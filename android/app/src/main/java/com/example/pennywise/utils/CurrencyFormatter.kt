package com.example.pennywise.utils

import java.text.NumberFormat
import java.util.Locale

object CurrencyFormatter {

    const val CURRENCY_CODE = "PKR"
    const val CURRENCY_SYMBOL = "Rs."

    private val numberFormat = NumberFormat.getNumberInstance(Locale("en", "PK")).apply {
        minimumFractionDigits = 2
        maximumFractionDigits = 2
    }

    /**
     * Converts a string user input (e.g. "1200.50") into minor units (Paisas: 120050).
     */
    fun parseAmountToMinor(input: String): Long {
        val clean = input.replace("[^0-9.]".toRegex(), "").trim()
        if (clean.isEmpty()) return 0L
        val parts = clean.split(".")
        val rupees = parts[0].toLongOrNull() ?: 0L
        val paisas = if (parts.size > 1) {
            val pStr = (parts[1] + "00").substring(0, 2)
            pStr.toLongOrNull() ?: 0L
        } else {
            0L
        }
        return rupees * 100L + paisas
    }

    /**
     * Formats minor units (Paisas) to standard display string.
     * Example: 154000L -> "Rs. 1,540.00"
     */
    fun formatPkr(minorUnits: Long, includeSign: Boolean = false): String {
        val isNegative = minorUnits < 0
        val abs = Math.abs(minorUnits)
        val value = abs.toDouble() / 100.0
        val formatted = numberFormat.format(value)
        val result = "$CURRENCY_SYMBOL $formatted"

        return if (includeSign) {
            when {
                isNegative -> "-$result"
                minorUnits > 0 -> "+$result"
                else -> result
            }
        } else {
            if (isNegative) "-$result" else result
        }
    }
}
