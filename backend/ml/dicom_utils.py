import pydicom
import numpy as np
import cv2

def load_dicom(path: str):
    dicom = pydicom.dcmread(path)

    pixel_array = dicom.pixel_array.astype(np.float32)

    # Normalize (important for X-rays)
    pixel_array -= pixel_array.min()
    pixel_array /= pixel_array.max()

    image = (pixel_array * 255).astype(np.uint8)

    image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)

    metadata = {
        "patient_id": dicom.get("PatientID", "Unknown"),
        "patient_name": str(dicom.get("PatientName", "Unknown")),
        "study_date": dicom.get("StudyDate", "Unknown"),
        "modality": dicom.get("Modality", "Unknown"),
        "institution": dicom.get("InstitutionName", "Unknown"),
    }

    return image, metadata
