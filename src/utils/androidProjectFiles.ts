export interface AndroidSourceFile {
  path: string;
  language: 'kotlin' | 'xml' | 'groovy' | 'markdown' | 'properties';
  description: string;
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidSourceFile[] = [
  {
    path: 'README.md',
    language: 'markdown',
    description: 'Internship documentation and project overview',
    content: `# Pennywise — Personal Expense & Income Tracker

**SyntecxHub — Week 4 Android App Development Internship Project**
*Developer:* SyntecxHub Android Intern
*Target Platform:* Android 8.0+ (API 26+)
*Language:* Kotlin
*Architecture:* MVVM (Model-View-ViewModel)

---

## 1. Project Overview
Pennywise is an offline-first, privacy-focused Android application designed to help individuals monitor income, track daily expenditures, organize financial records by standardized categories, evaluate monthly cash flow, and export transactional history for personal budgeting.

All data is persisted locally in an on-device SQLite database via **Android Room**. No account registration, network communication, or third-party cloud synchronizations are required.

The default currency is **Pakistani Rupee (PKR)**, formatted with centralized minor-unit arithmetic to eliminate floating-point precision loss.

---

## 2. Key Features

- **Dashboard & Financial Summary:**
  - Real-time aggregate calculation of **Current Balance**, **Total Income**, and **Total Expenses**.
  - Interactive monthly spending visualization using MPAndroidChart.
  - Recent transactions list with clear visual distinction between income (+) and expenses (-).
  - One-tap quick transaction creator.

- **Add & Edit Transactions:**
  - Support for both **Income** and **Expense** transaction types.
  - Strict input validation (amount > 0, required category selection).
  - Built-in Android Material DatePicker dialog.
  - Optional memo / note entry.
  - Updates database and invalidates cached view states immediately.

- **Transaction History & Comprehensive Filtering:**
  - RecyclerView with optimized \`DiffUtil\` and \`ViewBinding\`.
  - Filter by Type (All, Income, Expense).
  - Filter by Category (Food, Transport, Bills, Shopping, Salary, Freelance, etc.).
  - Date-range filtering (Start Date to End Date).
  - Search by note or category keyword.
  - Material Dialog confirmation before record deletion.

- **Monthly Reports & Analytics:**
  - Month-over-month navigation.
  - Net savings / cash flow calculation (Income - Expense).
  - Category breakdown with monetary totals and proportional percentages.
  - Visual category spending comparison.

- **Storage Access Framework (SAF) CSV Export:**
  - Generates RFC 4180 compliant CSV file (\`pennywise_transactions.csv\`).
  - Employs Android SAF \`ACTION_CREATE_DOCUMENT\` to respect scoped storage.
  - Properly escapes commas, double quotes, and line breaks.

---

## 3. Technology Stack & Architectural Design

| Component | Library / Framework | Rationale |
|---|---|---|
| **Language** | Kotlin 1.9+ | Modern, null-safe, coroutines support |
| **UI Framework** | Traditional Android Views & XML | ViewBinding, Material Components 3 |
| **Architecture** | MVVM (UI → ViewModel → Repository → Room) | Clean separation of concerns |
| **Persistence** | Android Room 2.6.1 + SQLite | Strict schema, compile-time SQL verification |
| **Async Operations** | Kotlin Coroutines & Flow/LiveData | Off-main-thread I/O with lifecycle awareness |
| **Visual Charts** | MPAndroidChart 3.1.0 | Lightweight, interactive native Android charts |
| **File Export** | Android Storage Access Framework (SAF) | Modern Android scoped storage compliance |

---

## 4. Database Schema (Room)

\`\`\`sql
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    type TEXT NOT NULL,
    amountMinor INTEGER NOT NULL, -- Stored in Paisas (1 PKR = 100 Paisas)
    category TEXT NOT NULL,
    note TEXT NOT NULL,
    transactionDate INTEGER NOT NULL,
    createdAt INTEGER NOT NULL
);
CREATE INDEX index_transactions_date ON transactions (transactionDate);
CREATE INDEX index_transactions_type ON transactions (type);
\`\`\`

> **Financial Integrity Note:** Currency amounts are stored as 64-bit integer minor units (\`Long\` in Kotlin) representing **paisas**. Floating-point values (\`Float\` / \`Double\`) are strictly forbidden in persistence and authoritative calculations to prevent round-off discrepancies.

---

## 5. How to Build & Run in Android Studio

1. **Clone or Download:** Extract the project folder into your workspace.
2. **Open in Android Studio:** Choose *File → Open* and select the project root.
3. **Sync Gradle:** Ensure Gradle finishes syncing dependencies automatically.
4. **Run:** Select an Android Emulator (API 26+) or physical Android device in USB Debugging mode, then click **Run (Shift + F10)**.

---

## 6. Unit Testing

Run unit tests via Gradle:
\`\`\`bash
./gradlew testDebugUnitTest
\`\`\`

Unit tests verify:
- \`CurrencyFormatterTest\`: Paisa conversion, formatting, edge cases.
- \`FinancialCalculationsTest\`: Aggregation formulas, net delta, zero-balance safeguards.
- \`CsvExporterTest\`: RFC 4180 delimiter and quote escaping.
`,
  },
  {
    path: 'build.gradle.kts',
    language: 'groovy',
    description: 'Top-level project build configuration',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.ksp) apply false
}
`,
  },
  {
    path: 'settings.gradle.kts',
    language: 'groovy',
    description: 'Gradle project settings and repository configuration',
    content: `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        maven { url = java.net.URI("https://jitpack.io") }
    }
}

rootProject.name = "Pennywise"
include(":app")
`,
  },
  {
    path: 'app/build.gradle.kts',
    language: 'groovy',
    description: 'App-level build script with Room, Coroutines, and MPAndroidChart',
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("com.google.devtools.ksp")
}

android {
    namespace = "com.example.pennywise"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.pennywise"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("androidx.navigation:navigation-fragment-ktx:2.7.7")
    implementation("androidx.navigation:navigation-ui-ktx:2.7.7")

    // Room Database
    val roomVersion = "2.6.1"
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    ksp("androidx.room:room-compiler:$roomVersion")

    // Lifecycle, ViewModel, LiveData
    val lifecycleVersion = "2.7.0"
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:$lifecycleVersion")
    implementation("androidx.lifecycle:lifecycle-livedata-ktx:$lifecycleVersion")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:$lifecycleVersion")

    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.0")

    // MPAndroidChart
    implementation("com.github.PhilJay:MPAndroidChart:v3.1.0")

    // Unit Testing
    testImplementation("junit:junit:4.13.2")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.8.0")
    testImplementation("androidx.arch.core:core-testing:2.2.0")
}
`,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    description: 'Application manifest declaration',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.Pennywise"
        tools:targetApi="31">
        <activity
            android:name=".ui.MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`,
  },
  {
    path: 'app/src/main/java/com/example/pennywise/data/local/entity/TransactionEntity.kt',
    language: 'kotlin',
    description: 'Room Entity for persistent transactions',
    content: `package com.example.pennywise.data.local.entity

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
`,
  },
  {
    path: 'app/src/main/java/com/example/pennywise/data/local/dao/TransactionDao.kt',
    language: 'kotlin',
    description: 'Room Data Access Object (DAO) with reactive and suspend operations',
    content: `package com.example.pennywise.data.local.dao

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
`,
  },
  {
    path: 'app/src/main/java/com/example/pennywise/data/local/AppDatabase.kt',
    language: 'kotlin',
    description: 'Thread-safe Room Database Singleton',
    content: `package com.example.pennywise.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.example.pennywise.data.local.dao.TransactionDao
import com.example.pennywise.data.local.entity.TransactionEntity

@Database(entities = [TransactionEntity::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {

    abstract fun transactionDao(): TransactionDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "pennywise_database"
                )
                    .fallbackToDestructiveMigration()
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/example/pennywise/data/repository/TransactionRepository.kt',
    language: 'kotlin',
    description: 'Repository handling database operations via Coroutines and LiveData',
    content: `package com.example.pennywise.data.repository

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
`,
  },
  {
    path: 'app/src/main/java/com/example/pennywise/viewmodel/ExpenseViewModel.kt',
    language: 'kotlin',
    description: 'MVVM ViewModel exposing LiveData and managing business logic',
    content: `package com.example.pennywise.viewmodel

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
`,
  },
  {
    path: 'app/src/main/java/com/example/pennywise/utils/CurrencyFormatter.kt',
    language: 'kotlin',
    description: 'Centralized PKR currency formatting and paisa conversion',
    content: `package com.example.pennywise.utils

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
`,
  },
  {
    path: 'app/src/main/java/com/example/pennywise/utils/CsvExporter.kt',
    language: 'kotlin',
    description: 'RFC 4180 compliant CSV generator for Storage Access Framework',
    content: `package com.example.pennywise.utils

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
`,
  },
  {
    path: 'app/src/main/java/com/example/pennywise/ui/MainActivity.kt',
    language: 'kotlin',
    description: 'Main Activity with ViewBinding and Bottom Navigation',
    content: `package com.example.pennywise.ui

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import com.example.pennywise.R
import com.example.pennywise.data.local.AppDatabase
import com.example.pennywise.data.repository.TransactionRepository
import com.example.pennywise.databinding.ActivityMainBinding
import com.example.pennywise.ui.addtransaction.AddTransactionBottomSheet
import com.example.pennywise.viewmodel.ExpenseViewModel
import com.example.pennywise.viewmodel.ExpenseViewModelFactory

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    lateinit var viewModel: ExpenseViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Initialize Room Database, Repository, and ViewModel
        val database = AppDatabase.getDatabase(this)
        val repository = TransactionRepository(database.transactionDao())
        val factory = ExpenseViewModelFactory(repository)
        viewModel = ViewModelProvider(this, factory)[ExpenseViewModel::class.java]

        // Setup Navigation with BottomNavigationView
        val navHostFragment = supportFragmentManager
            .findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        val navController = navHostFragment.navController
        binding.bottomNavigation.setupWithNavController(navController)

        // FAB Add Transaction Action
        binding.fabAddTransaction.setOnClickListener {
            val bottomSheet = AddTransactionBottomSheet()
            bottomSheet.show(supportFragmentManager, AddTransactionBottomSheet.TAG)
        }
    }
}
`,
  },
  {
    path: 'app/src/main/res/layout/activity_main.xml',
    language: 'xml',
    description: 'Root layout with BottomNavigationView, CoordinatorLayout, and FAB',
    content: `<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/colorBackground">

    <androidx.fragment.app.FragmentContainerView
        android:id="@+id/nav_host_fragment"
        android:name="androidx.navigation.fragment.NavHostFragment"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_marginBottom="64dp"
        app:defaultNavHost="true"
        app:navGraph="@navigation/nav_graph" />

    <com.google.android.material.bottomnavigation.BottomNavigationView
        android:id="@+id/bottomNavigation"
        android:layout_width="match_parent"
        android:layout_height="64dp"
        android:layout_gravity="bottom"
        android:background="@color/colorSurface"
        app:elevation="8dp"
        app:itemIconTint="@color/nav_item_color"
        app:itemTextColor="@color/nav_item_color"
        app:menu="@menu/menu_bottom_nav" />

    <com.google.android.material.floatingactionbutton.FloatingActionButton
        android:id="@+id/fabAddTransaction"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="bottom|end"
        android:layout_marginEnd="20dp"
        android:layout_marginBottom="80dp"
        android:contentDescription="@string/add_transaction"
        app:backgroundTint="@color/colorTealAccent"
        app:srcCompat="@drawable/ic_add"
        app:tint="@color/white" />

</androidx.coordinatorlayout.widget.CoordinatorLayout>
`,
  },
  {
    path: 'app/src/main/res/values/colors.xml',
    language: 'xml',
    description: 'Curated color palette with warm off-white and restrained teal accents',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- Pennywise Design System -->
    <color name="colorBackground">#F8F9FA</color>
    <color name="colorSurface">#FFFFFF</color>
    <color name="colorTextPrimary">#0F172A</color>
    <color name="colorTextSecondary">#64748B</color>
    <color name="colorTextMuted">#94A3B8</color>
    <color name="colorBorder">#E2E8F0</color>
    
    <!-- Brand & Accent Colors -->
    <color name="colorTealAccent">#0D9488</color>
    <color name="colorTealDark">#0F766E</color>
    <color name="colorTealLight">#CCFBF1</color>
    <color name="colorIncome">#059669</color>
    <color name="colorIncomeBg">#D1FAE5</color>
    <color name="colorExpense">#DC2626</color>
    <color name="colorExpenseBg">#FEE2E2</color>

    <color name="white">#FFFFFF</color>
    <color name="black">#000000</color>
</resources>
`,
  },
  {
    path: 'app/src/test/java/com/example/pennywise/CurrencyFormatterTest.kt',
    language: 'kotlin',
    description: 'Unit tests for currency formatting and minor unit calculations',
    content: `package com.example.pennywise

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
`,
  },
  {
    path: 'app/src/test/java/com/example/pennywise/CsvExporterTest.kt',
    language: 'kotlin',
    description: 'Unit tests verifying RFC 4180 CSV escaping',
    content: `package com.example.pennywise

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
`,
  }
];
