package com.example.pennywise.data.repository

import androidx.lifecycle.LiveData
import com.example.pennywise.data.local.dao.CategoryAggregate
import com.example.pennywise.data.local.dao.TransactionDao
import com.example.pennywise.data.local.entity.TransactionEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class TransactionRepository(private val transactionDao: TransactionDao) {

    val allTransactions: LiveData<List<TransactionEntity>> = transactionDao.getAllTransactionsLiveData()
    val totalIncome: LiveData<Long> = transactionDao.getTotalIncomeLiveData()
    val totalExpenses: LiveData<Long> = transactionDao.getTotalExpensesLiveData()

    fun getRecentTransactions(limit: Int = 5): LiveData<List<TransactionEntity>> {
        return transactionDao.getRecentTransactions(limit)
    }

    suspend fun insert(transaction: TransactionEntity): Long = withContext(Dispatchers.IO) {
        transactionDao.insertTransaction(transaction)
    }

    suspend fun update(transaction: TransactionEntity): Int = withContext(Dispatchers.IO) {
        transactionDao.updateTransaction(transaction)
    }

    suspend fun delete(transaction: TransactionEntity): Int = withContext(Dispatchers.IO) {
        transactionDao.deleteTransaction(transaction)
    }

    suspend fun deleteById(id: Long): Int = withContext(Dispatchers.IO) {
        transactionDao.deleteById(id)
    }

    suspend fun getAllTransactionsSync(): List<TransactionEntity> = withContext(Dispatchers.IO) {
        transactionDao.getAllTransactions()
    }

    suspend fun getMonthlySummary(startDate: Long, endDate: Long): Triple<Long, Long, List<CategoryAggregate>> =
        withContext(Dispatchers.IO) {
            val income = transactionDao.getIncomeForPeriod(startDate, endDate)
            val expense = transactionDao.getExpenseForPeriod(startDate, endDate)
            val breakdown = transactionDao.getCategoryExpensesForPeriod(startDate, endDate)
            Triple(income, expense, breakdown)
        }
}
