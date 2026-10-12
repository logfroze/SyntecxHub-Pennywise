package com.example.pennywise

import com.example.pennywise.utils.CsvExporter
import org.junit.Assert.assertEquals
import org.junit.Test

class CsvExporterTest {

    @Test
    fun escapeField_preservesSimpleString() {
        assertEquals("SimpleNote", CsvExporter.escapeField("SimpleNote"))
    }

    @Test
    fun escapeField_escapesCommas() {
        assertEquals("\"Milk, Bread\"", CsvExporter.escapeField("Milk, Bread"))
    }

    @Test
    fun escapeField_escapesQuotes() {
        assertEquals("\"He said \"\"Hello\"\"\"", CsvExporter.escapeField("He said \"Hello\""))
    }

    @Test
    fun escapeField_escapesNewlines() {
        assertEquals("\"Line1\nLine2\"", CsvExporter.escapeField("Line1\nLine2"))
    }
}
