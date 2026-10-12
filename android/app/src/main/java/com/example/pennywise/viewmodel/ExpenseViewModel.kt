package com.example.pennywise.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MediatorLiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.pennywise.data.local.dao.CategoryAggregate
import com.example.pennywise.data.local.entity.TransactionEntity
import com.example.pennywise.data.repository.TransactionRepository
import kotlinx.coroutines.launch
import java.util.Calendar

data class MonthlyReportState(
    val year: Int,
    val month: Int, // 0 = Jan
    val incomeMinor: Long,
    val expenseMinor: Long,
    val netMinor: Long,
    val categoryBreakdown: List<CategoryAggregate>
)

class ExpenseViewModel(private val repository: TransactionRepository) : ViewModel() {

    val allTransactions: LiveData<List<TransactionEntity>> = repository.allTransactions
    val recentTransactions: LiveData<List<TransactionEntity>> = repository.getRecentTransactions(5)
    val totalIncome: LiveData<Long> = repository.totalIncome
    val totalExpenses: LiveData<Long> = repository.totalExpenses

    // Computed Overall Balance LiveData (Total Income - Total Expenses)
    val totalBalance: MediatorLiveData<Long> = MediatorLiveData<Long>().apply {
        var currentIncome = 0L
        var currentExpenses = 0L

        fun updateBalance() {
            value = currentIncome - currentExpenses
        }

        addSource(totalIncome) { income ->
            currentIncome = income ?: 0L
            updateBalance()
        }
        addSource(totalExpenses) { expenses ->
            currentExpenses = expenses ?: 0L
            updateBalance()
        }
    }

    // Monthly Report Reactive State
    private val _monthlyReport = MutableLiveData<MonthlyReportState>()
    val monthlyReport: LiveData<MonthlyReportState> = _monthlyReport

    // Selected Month & Year
    var selectedCalendar: Calendar = Calendar.getInstance().apply {
        set(Calendar.DAY_OF_MONTH, 1)
        set(Calendar.HOUR_OF_DAY, 0)
        set(Calendar.MINUTE, 0)
        set(Calendar.SECOND, 0)
        set(Calendar.MILLISECOND, 0)
    }

    init {
        loadMonthlyReport()
    }

    fun loadMonthlyReport() {
        val startCal = selectedCalendar.clone() as Calendar
        startCal.set(Calendar.DAY_OF_MONTH, 1)
        startCal.set(Calendar.HOUR_OF_DAY, 0)
        startCal.set(Calendar.MINUTE, 0)
        startCal.set(Calendar.SECOND, 0)
        startCal.set(Calendar.MILLISECOND, 0)

        val endCal = selectedCalendar.clone() as Calendar
        endCal.set(Calendar.DAY_OF_MONTH, endCal.getActualMaximum(Calendar.DAY_OF_MONTH))
        endCal.set(Calendar.HOUR_OF_DAY, 23)
        endCal.set(Calendar.MINUTE, 59)
        endCal.set(Calendar.SECOND, 59)
        endCal.set(Calendar.MILLISECOND, 999)

        viewModelScope.launch {
            val (income, expense, breakdown) = repository.getMonthlySummary(
                startCal.timeInMillis,
                endCal.timeInMillis
            )
            _monthlyReport.value = MonthlyReportState(
                year = selectedCalendar.get(Calendar.YEAR),
                month = selectedCalendar.get(Calendar.MONTH),
                incomeMinor = income,
                expenseMinor = expense,
                netMinor = income - expense,
                categoryBreakdown = breakdown
            )
        }
    }

    fun navigateMonth(delta: Int) {
        selectedCalendar.add(Calendar.MONTH, delta)
        loadMonthlyReport()
    }

    fun addTransaction(
        type: String,
        amountMinor: Long,
        category: String,
        note: String,
        date: Long,
        onSuccess: () -> Unit
    ) {
        viewModelScope.launch {
            repository.insert(
                TransactionEntity(
                    type = type,
                    amountMinor = amountMinor,
                    category = category,
                    note = note,
                    transactionDate = date
                )
            )
            loadMonthlyReport()
            onSuccess()
        }
    }

    fun updateTransaction(
        transaction: TransactionEntity,
        onSuccess: () -> Unit
    ) {
        viewModelScope.launch {
            repository.update(transaction)
            loadMonthlyReport()
            onSuccess()
        }
    }

    fun deleteTransaction(transaction: TransactionEntity, onSuccess: () -> Unit) {
        viewModelScope.launch {
            repository.delete(transaction)
            loadMonthlyReport()
            onSuccess()
        }
    }

    suspend fun getAllTransactionsForExport(): List<TransactionEntity> {
        return repository.getAllTransactionsSync()
    }
}
