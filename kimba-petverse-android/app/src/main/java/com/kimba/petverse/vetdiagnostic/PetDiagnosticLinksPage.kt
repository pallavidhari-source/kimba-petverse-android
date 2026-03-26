package com.kimba.petverse.vetdiagnostic

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class VetDiagnosticActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_vet_diagnostic)

        // Initialize the VetDiagnosticFragment
        if (savedInstanceState == null) {
            supportFragmentManager.beginTransaction()
                .replace(R.id.fragment_container, VetDiagnosticFragment())
                .commit()
        }
    }
}