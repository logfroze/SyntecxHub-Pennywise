package com.example.pennywise

import com.example.pennywise.utils.CurrencyFormatter
import org.junit.Assert.assertEquals
import org.junit.Test

class CurrencyFormatterTest {

    @Test
    fun parseAmountToMinor_handlesIntegersAndDecimals() {
        assertEquals(100000L, CurrencyFormatter.parseAmountToMinor("1000"))
        assertEquals(100050L, CurrencyFormatter.parseAmountToMinor("1000.50"))
        assertEquals(100005L, CurrencyFormatter.parseAmountToMinor("1000.05"))
        assertEquals(50L, CurrencyFormatter.parseAmountToMinor("0.50"))
        assertEquals(0L, CurrencyFormatter.parseAmountToMinor(""))
        assertEquals(0L, CurrencyFormatter.parseAmountToMinor("invalid"))
    }

    @Test
    fun formatPkr_formatsCorrectly() {
        val result = CurrencyFormatter.formatPkr(154000L)
        assertEquals("Rs. 1,540.00", result)
    }

    @Test
    fun formatPkr_withSigns() {
        assertEquals("+Rs. 500.00", CurrencyFormatter.formatPkr(50000L, includeSign = true))
        assertEquals("-Rs. 320.00", CurrencyFormatter.formatPkr(-32000L, includeSign = true))
    }
}
