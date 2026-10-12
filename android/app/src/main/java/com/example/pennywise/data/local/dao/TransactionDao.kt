package com.example.pennywise.data.local.dao

import androidx.lifecycle.LiveData
import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.pennywise.data.local.entity.TransactionEntity

data class CategoryAggregate(
    val category: String,
    val totalAmount: Long,
    val count: Int
)

@Dao
interface TransactionDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTransaction(transaction: TransactionEntity): Long

    @Update
    suspend fun updateTransaction(transaction: TransactionEntity): Int

    @Delete
    suspend fun deleteTransaction(transaction: TransactionEntity): Int

    @Query("DELETE FROM transactions WHERE id = :id")
    suspend fun deleteById(id: Long): Int

    @Query("SELECT * FROM transactions ORDER BY transactionDate DESC, id DESC")
    fun getAllTransactionsLiveData(): LiveData<List<TransactionEntity>>

    @Query("SELECT * FROM transactions ORDER BY transactionDate DESC, id DESC")
    suspend fun getAllTransactions(): List<TransactionEntity>

    @Query("SELECT * FROM transactions ORDER BY transactionDate DESC, id DESC LIMIT :limit")
    fun getRecentTransactions(limit: Int): LiveData<List<TransactionEntity>>

    @Query("SELECT * FROM transactions WHERE transactionDate BETWEEN :startDate AND :endDate ORDER BY transactionDate DESC")
    fun getTransactionsBetweenDates(startDate: Long, endDate: Long): LiveData<List<TransactionEntity>>

    @Query("SELECT * FROM transactions WHERE transactionDate BETWEEN :startDate AND :endDate ORDER BY transactionDate DESC")
    suspend fun getTransactionsBetweenDatesSync(startDate: Long, endDate: Long): List<TransactionEntity>

    @Query("SELECT COALESCE(SUM(amountMinor), 0) FROM transactions WHERE type = 'INCOME'")
    fun getTotalIncomeLiveData(): LiveData<Long>

    @Query("SELECT COALESCE(SUM(amountMinor), 0) FROM transactions WHERE type = 'EXPENSE'")
    fun getTotalExpensesLiveData(): LiveData<Long>

    @Query("SELECT COALESCE(SUM(amountMinor), 0) FROM transactions WHERE type = 'INCOME' AND transactionDate BETWEEN :startDate AND :endDate")
    suspend fun getIncomeForPeriod(startDate: Long, endDate: Long): Long

    @Query("SELECT COALESCE(SUM(amountMinor), 0) FROM transactions WHERE type = 'EXPENSE' AND transactionDate BETWEEN :startDate AND :endDate")
    suspend fun getExpenseForPeriod(startDate: Long, endDate: Long): Long

    @Query("""
        SELECT category, SUM(amountMinor) as totalAmount, COUNT(*) as count 
        FROM transactions 
        WHERE type = 'EXPENSE' AND transactionDate BETWEEN :startDate AND :endDate 
        GROUP BY category 
        ORDER BY totalAmount DESC
    """)
    suspend fun getCategoryExpensesForPeriod(startDate: Long, endDate: Long): List<CategoryAggregate>
}
