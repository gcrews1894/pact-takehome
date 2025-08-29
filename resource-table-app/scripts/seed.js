/* eslint-disable @typescript-eslint/no-require-imports */
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ProcessingState = {
  PROCESSING_STATE_UNSPECIFIED: "PROCESSING_STATE_UNSPECIFIED",
  PROCESSING_STATE_NOT_STARTED: "PROCESSING_STATE_NOT_STARTED",
  PROCESSING_STATE_PROCESSING: "PROCESSING_STATE_PROCESSING",
  PROCESSING_STATE_COMPLETED: "PROCESSING_STATE_COMPLETED",
  PROCESSING_STATE_FAILED: "PROCESSING_STATE_FAILED",
};

const FHIRVersion = {
  FHIR_VERSION_UNSPECIFIED: "FHIR_VERSION_UNSPECIFIED",
  FHIR_VERSION_R4: "FHIR_VERSION_R4",
  FHIR_VERSION_R4B: "FHIR_VERSION_R4B",
};

const sampleResources = [
  {
    resource: {
      metadata: {
        state: ProcessingState.PROCESSING_STATE_COMPLETED,
        createdTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        fetchTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10000).toISOString(),
        processedTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30000).toISOString(),
        identifier: {
          key: 'patient-001-observation-vitals',
          uid: 'obs-vitals-12345',
          patientId: 'patient-001',
        },
        resourceType: 'Observation',
        version: FHIRVersion.FHIR_VERSION_R4,
      },
      humanReadableStr: 'Blood Pressure Reading: 120/80 mmHg, Heart Rate: 72 bpm, Temperature: 98.6°F. Patient vitals are within normal ranges. Recorded during routine checkup on 2024-08-27.',
      aiSummary: 'Normal vital signs recorded during routine examination. All measurements fall within healthy ranges for adult patient.',
    },
  },
  {
    resource: {
      metadata: {
        state: ProcessingState.PROCESSING_STATE_COMPLETED,
        createdTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        fetchTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 5000).toISOString(),
        processedTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 25000).toISOString(),
        identifier: {
          key: 'patient-002-medication-prescription',
          uid: 'med-rx-67890',
          patientId: 'patient-002',
        },
        resourceType: 'MedicationRequest',
        version: FHIRVersion.FHIR_VERSION_R4,
      },
      humanReadableStr: 'Prescription for Lisinopril 10mg, once daily for hypertension. 30-day supply with 2 refills. Prescribed by Dr. Smith on 2024-08-26. Patient counseled on potential side effects and monitoring requirements.',
      aiSummary: 'ACE inhibitor prescribed for blood pressure management. Standard dosing with appropriate monitoring plan.',
    },
  },
  {
    resource: {
      metadata: {
        state: ProcessingState.PROCESSING_STATE_PROCESSING,
        createdTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        fetchTime: new Date(Date.now() - 1 * 60 * 60 * 1000 + 2000).toISOString(),
        identifier: {
          key: 'patient-003-lab-results',
          uid: 'lab-cbc-11111',
          patientId: 'patient-003',
        },
        resourceType: 'DiagnosticReport',
        version: FHIRVersion.FHIR_VERSION_R4B,
      },
      humanReadableStr: 'Complete Blood Count (CBC) results: WBC 7.5, RBC 4.8, Hemoglobin 14.2, Hematocrit 42.1, Platelets 285. All values within normal limits. Collected on 2024-08-29.',
      aiSummary: 'Complete blood count shows normal hematological parameters. No signs of anemia, infection, or bleeding disorders.',
    },
  },
  {
    resource: {
      metadata: {
        state: ProcessingState.PROCESSING_STATE_FAILED,
        createdTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        fetchTime: new Date(Date.now() - 30 * 60 * 1000 + 1000).toISOString(),
        identifier: {
          key: 'patient-004-imaging-xray',
          uid: 'img-xray-22222',
          patientId: 'patient-004',
        },
        resourceType: 'ImagingStudy',
        version: FHIRVersion.FHIR_VERSION_R4,
      },
      humanReadableStr: 'Chest X-ray study failed to process due to corrupted image data. Study was performed on 2024-08-29 but requires re-acquisition.',
    },
  },
  {
    resource: {
      metadata: {
        state: ProcessingState.PROCESSING_STATE_COMPLETED,
        createdTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        fetchTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 8000).toISOString(),
        processedTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 35000).toISOString(),
        identifier: {
          key: 'patient-001-condition-diabetes',
          uid: 'cond-dm-33333',
          patientId: 'patient-001',
        },
        resourceType: 'Condition',
        version: FHIRVersion.FHIR_VERSION_R4,
      },
      humanReadableStr: 'Type 2 Diabetes Mellitus, well-controlled with metformin. HbA1c 6.8%. Patient demonstrates good medication adherence and lifestyle management. Regular monitoring recommended.',
      aiSummary: 'Well-managed Type 2 diabetes with good glycemic control. Current treatment plan is effective.',
    },
  },
  {
    resource: {
      metadata: {
        state: ProcessingState.PROCESSING_STATE_COMPLETED,
        createdTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        fetchTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 3000).toISOString(),
        processedTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 20000).toISOString(),
        identifier: {
          key: 'patient-005-procedure-colonoscopy',
          uid: 'proc-colon-44444',
          patientId: 'patient-005',
        },
        resourceType: 'Procedure',
        version: FHIRVersion.FHIR_VERSION_R4,
      },
      humanReadableStr: 'Routine screening colonoscopy performed successfully. No polyps or abnormal findings detected. Bowel preparation was adequate. Next screening recommended in 10 years.',
      aiSummary: 'Normal screening colonoscopy with no pathological findings. Standard follow-up interval recommended.',
    },
  },
  {
    resource: {
      metadata: {
        state: ProcessingState.PROCESSING_STATE_NOT_STARTED,
        createdTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        fetchTime: new Date(Date.now() - 10 * 60 * 1000 + 500).toISOString(),
        identifier: {
          key: 'patient-006-appointment-followup',
          uid: 'appt-fu-55555',
          patientId: 'patient-006',
        },
        resourceType: 'Appointment',
        version: FHIRVersion.FHIR_VERSION_R4,
      },
      humanReadableStr: 'Follow-up appointment scheduled for 2024-09-15 at 2:00 PM with Dr. Johnson for blood pressure monitoring and medication review.',
    },
  },
  {
    resource: {
      metadata: {
        state: ProcessingState.PROCESSING_STATE_COMPLETED,
        createdTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        fetchTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 12000).toISOString(),
        processedTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 45000).toISOString(),
        identifier: {
          key: 'patient-002-allergy-penicillin',
          uid: 'allergy-pen-66666',
          patientId: 'patient-002',
        },
        resourceType: 'AllergyIntolerance',
        version: FHIRVersion.FHIR_VERSION_R4,
      },
      humanReadableStr: 'Confirmed penicillin allergy with history of rash and hives. Severity: Moderate. Patient carries medical alert bracelet. Alternative antibiotics should be used when needed.',
      aiSummary: 'Documented moderate penicillin allergy requiring alternative antibiotic selection for future treatments.',
    },
  },
];

async function seedResources() {
  try {
    console.log('Starting to seed resources...');
    console.log(`Connecting to project: ${firebaseConfig.projectId}`);
    
    const resourcesCollection = collection(db, 'resources');
    
    for (let i = 0; i < sampleResources.length; i++) {
      const resource = sampleResources[i];
      await addDoc(resourcesCollection, resource);
      console.log(`Added resource ${i + 1}/${sampleResources.length}: ${resource.resource.metadata.resourceType}`);
    }
    
    console.log('Successfully seeded all resources!');
    console.log('You can now refresh your app to see the data.');
    
  } catch (error) {
    console.error('Error seeding resources:', error);
    console.error('Troubleshooting tips:');
    console.error('- Check your Firebase config in .env.local');
    console.error('- Ensure Firestore is enabled in your Firebase project');
    console.error('- Make sure Firestore rules allow writes (test mode)');
    process.exit(1);
  }
}

seedResources();