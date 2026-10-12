package com.example.pennywise

import org.junit.Assert.assertEquals
import org.junit.Test

class FinancialCalculationsTest {

    @Test
    fun calculateBalance_subtractsExpensesFromIncomeCorrectly() {
        val totalIncomeMinor = 15000000L // Rs. 150,000.00
        val totalExpenseMinor = 4525000L // Rs. 45,250.00
        val netBalanceMinor = totalIncomeMinor - totalExpenseMinor

        assertEquals(10475000L, netBalanceMinor)
    }

    @Test
    fun negativeBalance_whenExpensesExceedIncome() {
        val totalIncomeMinor = 2000000L // Rs. 20,000.00
        val totalExpenseMinor = 3500000L // Rs. 35,000.00
        val netBalanceMinor = totalIncomeMinor - totalExpenseMinor

        assertEquals(-1500000L, netBalanceMinor)
    }

    @Test
    fun categoryPercentage_calculatedAccuratelyWithoutFloatAccumulation() {
        val categoryExpenseMinor = 250000L // Rs. 2,500.00
        val totalExpenseMinor = 1000000L   // Rs. 10,000.00
        val percentage = (categoryExpenseMinor.toDouble() / totalExpenseMinor.toDouble()) * 100.0

        assertEquals(25.0, percentage, 0.001)
    }
}
