package com.example.pennywise.data.local.entity

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

/**
 * Room database entity representing a single financial transaction.
 *
 * All monetary amounts are stored in minor currency units (e.g. Paisas in PKR: 1 PKR = 100 Paisas)
 * using [Long] to eliminate floating-point rounding errors.
 */
@Entity(
    tableName = "transactions",
    indices = [
        Index(value = ["transactionDate"]),
        Index(value = ["type"]),
        Index(value = ["category"])
    ]
)
data class TransactionEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val type: String, // "INCOME" or "EXPENSE"
    val amountMinor: Long, // Amount in Paisas
    val category: String,
    val note: String,
    val transactionDate: Long, // Epoch timestamp in milliseconds
    val createdAt: Long = System.currentTimeMillis()
)
