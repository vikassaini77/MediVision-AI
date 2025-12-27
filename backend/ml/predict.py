from fastapi import APIRouter, UploadFile, File
import tempfile
from .dicom_utils import load_dicom
from .inference import predict_image

router = APIRouter()

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    suffix = file.filename.split(".")[-1]

    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{suffix}") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    if suffix.lower() == "dcm":
        image, metadata = load_dicom(tmp_path)
    else:
        raise ValueError("Only DICOM (.dcm) files are allowed")

    result = predict_image(image)

    return {
        "prediction": result["label"],
        "confidence": result["confidence"],
        "risk": result["risk"],
        "dicom_metadata": metadata
    }
