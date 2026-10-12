package com.example.pennywise.utils

import com.example.pennywise.data.local.entity.TransactionEntity
import java.io.OutputStream
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

object CsvExporter {

    private val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.US)

    fun exportTransactionsToStream(transactions: List<TransactionEntity>, outputStream: OutputStream) {
        val writer = outputStream.bufferedWriter()

        // Headers
        writer.write("Transaction ID,Type,Amount,Currency,Category,Title or Note,Transaction Date")
        writer.newLine()

        for (t in transactions) {
            val amountFormatted = String.format(Locale.US, "%.2f", t.amountMinor / 100.0)
            val dateFormatted = dateFormat.format(Date(t.transactionDate))

            val line = listOf(
                escapeField(t.id.toString()),
                escapeField(t.type),
                escapeField(amountFormatted),
                escapeField("PKR"),
                escapeField(t.category),
                escapeField(t.note),
                escapeField(dateFormatted)
            ).joinToString(",")

            writer.write(line)
            writer.newLine()
        }

        writer.flush()
    }

    fun escapeField(field: String): String {
        return if (field.contains(",") || field.contains("\"") || field.contains("\n") || field.contains("\r")) {
            "\"" + field.replace("\"", "\"\"") + "\""
        } else {
            field
        }
    }
}
