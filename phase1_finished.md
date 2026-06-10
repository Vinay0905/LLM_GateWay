in one terminal : 
    - cd llm-gateway/gateway
    - go run ./cmd

You should see:
    - `Server listinering on :8080`

in another terminal :
    - curl -i http://localhost:8080/v1/chat \
        -H "Content-Type: application/json" \
        -d '{"model":"gemini-1.5.flash","prompt":"Hey bruv","max_tokens":64,"temperature":0.2}'



Then u will get an output

and rember that the port we are using is 8080 and the sidecar will be 8000!!!