import child_process from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { Bundle, FhirResource, Reference } from 'fhir/r4';

const SYNTHEA_BINARY = 'synthea-with-dependencies.jar';
const SYNTHEA_CONFIG = 'synthea.properties';
const MODULES_DIR = 'modules';
const KEEP_FILE = 'keep/cardio.json';
const SYNTHEA_OUTPUT_DIR = 'output/fhir';
const POST_PROCESSED_OUTPUT_DIR = 'output/post-processed';

const HOME_ENVIRONMENT = {
  url: 'http://hl7.org/fhir/us/vitals/StructureDefinition/MeasurementSettingExt',
  valueCodeableConcept: {
    coding: [
      {
        system: 'http://snomed.info/sct',
        code: '264362003',
        display: 'Home (environment)',
      },
    ],
  },
};
const HOME_DATASET_LABEL_SUFFIX = ' (Home)';

await main();

async function main() {
  const patients = await generatePatients();
  Promise.all(patients.map((patientName) => postProcessPatient(patientName)));
}

async function postProcessPatient(patientName: string) {
  const bundle = await loadPatientBundle(patientName);
  keepResources(bundle, ['Patient', 'Observation', 'Encounter', 'MedicationRequest']);
  addMeasurementSetting(bundle);
  addMedicationDuration(bundle);
  await savePatientBundle(patientName, bundle);
}

/** Run Synthea and scrape stdout for patient names */
async function generatePatients() {
  return new Promise<string[]>((resolve, reject) => {
    const patients: string[] = [];
    const args = ['-jar', SYNTHEA_BINARY, '-c', SYNTHEA_CONFIG, '-d', MODULES_DIR, '-k', KEEP_FILE, ...process.argv.slice(2)];
    const synthea = child_process.spawn('java', args);
    let incompleteLine = '';
    synthea.stdout.on('data', (chunk) => {
      const text = incompleteLine + String(chunk);
      const lines = text.split('\n');
      incompleteLine = lines.pop();
      for (let line of lines) {
        console.log(line);
        const match = text.match(/\d+ -- (?<first>\w+) (?<last>\w+)/);
        if (match) {
          patients.push(`${match.groups.first}_${match.groups.last}`);
        }
      }
    });
    synthea.on('close', () => resolve(patients));
    synthea.on('error', reject);
  });
}

/** Load patient's JSON bundle from matching filename */
async function loadPatientBundle(patientName: string) {
  const files = await fs.readdir(SYNTHEA_OUTPUT_DIR);
  const filename = files.find((f) => f.startsWith(patientName));
  const filepath = path.join(SYNTHEA_OUTPUT_DIR, filename);
  console.log(`Reading File ${filepath}`);
  const text = await fs.readFile(filepath, { encoding: 'utf8' });
  return JSON.parse(text);
}

/** Write patient's JSON bundle to a file */
async function savePatientBundle(patientName: string, bundle: Bundle) {
  const patient = bundle.entry.find((entry) => entry.resource.resourceType === 'Patient')?.resource;
  const filename = `${patientName}_${patient.id}.json`;
  const filepath = path.join(POST_PROCESSED_OUTPUT_DIR, filename);
  console.log(`Writing File ${filepath}`);
  await fs.mkdir(POST_PROCESSED_OUTPUT_DIR, { recursive: true });
  await fs.writeFile(filepath, JSON.stringify(bundle, null, 2));
}

/** Add Measurement Setting extension to Observations with an associated "Encounter by computer link" */
function addMeasurementSetting(bundle: Bundle) {
  console.log('Adding Measurement Setting Extension');
  for (let entry of bundle.entry) {
    if (entry.resource.resourceType === 'Observation' && entry.resource.code.text.endsWith(HOME_DATASET_LABEL_SUFFIX)) {
      entry.resource.code.text = trimSuffix(entry.resource.code.text, HOME_DATASET_LABEL_SUFFIX);
      entry.resource.code.coding[0].display = trimSuffix(entry.resource.code.coding[0].display, HOME_DATASET_LABEL_SUFFIX);
      entry.resource.meta = entry.resource.meta ?? {};
      entry.resource.meta.extension = entry.resource.meta.extension ?? [];
      entry.resource.meta.extension.push(HOME_ENVIRONMENT);
    }
  }
}

/** Add boundsDuration to MedicationRequest */
function addMedicationDuration(bundle: Bundle) {
  console.log('Adding Medication Duration');
  for (let entry of bundle.entry) {
    if (entry.resource.resourceType === 'MedicationRequest' && entry.resource.dosageInstruction) {
      for (let dosage of entry.resource.dosageInstruction) {
        if (dosage.timing?.repeat) {
          dosage.timing.repeat.boundsDuration = { code: 'd', value: 60 };
        }
      }
    }
  }
}

function resolveReference(bundle: Bundle, ref: Reference): FhirResource {
  const prefix = 'urn:uuid:';
  const id = ref.reference.startsWith(prefix) ? ref.reference.substring(prefix.length) : ref.reference;
  return bundle.entry.find((entry) => entry.resource.id === id)?.resource;
}

function trimSuffix(label: string, suffix: string) {
  if (label.endsWith(suffix)) {
    return label.substring(0, label.length - suffix.length);
  }
  return label;
}

function keepResources(bundle: Bundle, resourceTypes: FhirResource['resourceType'][]) {
  console.log(`Removing all resources except [${resourceTypes.join(', ')}]`);
  bundle.entry = bundle.entry.filter((entry) => resourceTypes.includes(entry.resource.resourceType));
}
