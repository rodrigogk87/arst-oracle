#!/bin/bash

# 📄 Cargar variables del archivo .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo "❌ No se encontró archivo .env"
  exit 1
fi

# ✅ Verificar que se pase NETWORK como argumento
if [ -z "$1" ]; then
  echo "❌ Debes especificar la red como argumento. Ejemplo: ./deploy.sh sepolia"
  echo "Redes disponibles: sepolia, arb_sepolia, optimism, base, etc."
  exit 1
fi

NETWORK=$1

# 🔠 Convertir a mayúsculas
NETWORK_UPPER=$(echo "$NETWORK" | tr '[:lower:]' '[:upper:]')

# 🌐 Armar nombre dinámico de variable para RPC
RPC_VAR_NAME="${NETWORK_UPPER}_RPC_URL"
RPC_URL=${!RPC_VAR_NAME}

if [ -z "$RPC_URL" ]; then
  echo "❌ No se encontró RPC URL para $NETWORK (variable $RPC_VAR_NAME en .env)"
  exit 1
fi

# ⚡ Armar nombre dinámico de variable para router
ROUTER_VAR_NAME="${NETWORK_UPPER}_FUNCTIONS_ROUTER"
ROUTER=${!ROUTER_VAR_NAME}

if [ -z "$ROUTER" ]; then
  echo "❌ No se encontró FUNCTIONS_ROUTER para $NETWORK (variable $ROUTER_VAR_NAME en .env)"
  exit 1
fi

echo "🚀 Deploying en red: $NETWORK"
echo "🔗 RPC URL: $RPC_URL"
echo "🔌 Router address: $ROUTER"

# 🟢 Exportar router genérico que lee el contrato
export FUNCTIONS_ROUTER=$ROUTER

# 🏗️ Ejecutar forge script
forge script script/Deploy.s.sol \
  --rpc-url "$RPC_URL" \
  --broadcast \
  --verify \
  -vvvv

#./deploy.sh arb_sepolia
#./deploy.sh sepolia