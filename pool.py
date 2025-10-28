from fastapi import FastAPI
import subprocess

app = FastAPI()

@app.get("/invoke")
def run_stellar_contract():
    cmd = [
        "stellar",
        "contract", "invoke",
        "--id", "CC457P2NWSB3BES7LBZXTVFHNULMNFNVT76O5AVQLLRKR22M5FQOJV7T",
        "--source-account", "alice",
        "--network", "testnet",
        "--", "get_paid",
        "--to", "GAYCS3QNKIN5MQ42YY24ZFYQFWLMFFWCCCK5RLIJLHCWK5WPLLX5C2IP",
        "--amount", "5000000"
    ]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return {
            "status": "success",
            "stdout": result.stdout,
            "stderr": result.stderr
        }
    except subprocess.CalledProcessError as e:
        return {
            "status": "error",
            "stderr": e.stderr
        }