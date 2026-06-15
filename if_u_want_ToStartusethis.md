#### Step 1: Restart the Python Safety Sidecar
  
  In the terminal window running your python safety sidecar:
  
  1. Stop the server with  Ctrl + C .
  2. Run these commands:
    cd /Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/safety_sidecar
    # Copy the root .env file so the sidecar loads the keys natively
    cp ../../.env .env
    # Start the sidecar
    uvicorn main:app --host 127.0.0.1 --port 8000
  

  #### Step 2: Restart the Go Gateway Server
  
  In the terminal window running your Go gateway server:
  
  1. Stop the server with  Ctrl + C .
  2. Run these commands:
    cd /Users/mast/Documents/VInayPrograming/LLM_GateWay/llm-gateway/gateway
    export SAFETY_BASE_URL="http://127.0.0.1:8000"
    # Use the correct relative path to load the root .env file
    export ENV_FILE=../../.env
    export DEBUG_HEADERS=true
    go run ./cmd