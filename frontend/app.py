
import streamlit as st
import requests
from PIL import Image
import base64, io

st.set_page_config(page_title="MedVision AI", layout="centered")
st.title("🩺 MedVision AI")

uploaded = st.file_uploader("Upload Chest X-ray", type=["jpg","png","jpeg"])

if uploaded:
    st.image(Image.open(uploaded), caption="Uploaded X-ray")

    response = requests.post(
        "http://127.0.0.1:8000/predict",
        files={"file": uploaded.getvalue()}
    )

    if response.status_code == 200:
        data = response.json()
        st.success(f"Prediction: {data['prediction']}")
        st.write("Confidence:", round(data["confidence"], 4))

        cam = base64.b64decode(data["grad_cam"])
        st.image(Image.open(io.BytesIO(cam)), caption="Grad-CAM Explanation")
    else:
        st.error("Backend not running")
