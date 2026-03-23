#!/bin/bash
# AISliDev Deployment Script
# Optimized for Docker + Colima on macOS

set -e

# Configuration
IMAGE_NAME="aislidev"
CONTAINER_NAME="aislidev"
PORT="${PORT:-13000}"
DATA_PATH="${DATA_PATH:-./data}"

# Detect container runtime (prefer Docker for Colima)
if command -v docker &> /dev/null; then
    RUNTIME="docker"
elif command -v podman &> /dev/null; then
    RUNTIME="podman"
else
    echo "❌ Error: Neither Docker nor Podman found."
    echo "📝 For macOS users: Install Colima + Docker CLI:"
    echo "    brew install colima docker"
    echo "    colima start"
    exit 1
fi

echo "🔧 Using container runtime: $RUNTIME"

# Function to build image
build_image() {
    echo "🏗️  Building image: $IMAGE_NAME"
    $RUNTIME build -t $IMAGE_NAME -f Dockerfile .
    echo "✅ Image built successfully"
}

# Function to stop and remove existing container
cleanup_container() {
    if $RUNTIME ps -a --format "{{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        echo "🛑 Stopping existing container: $CONTAINER_NAME"
        $RUNTIME stop $CONTAINER_NAME 2>/dev/null || true
        echo "🗑️  Removing existing container: $CONTAINER_NAME"
        $RUNTIME rm $CONTAINER_NAME 2>/dev/null || true
    fi
}

# Function to run container
run_container() {
    echo "🚀 Starting container: $CONTAINER_NAME"
    
    # Create data directory if it doesn't exist
    mkdir -p "$DATA_PATH"
    
    # Determine volume mount flag (Docker uses standard, Podman may use :Z for SELinux)
    if [ "$RUNTIME" = "podman" ]; then
        VOLUME_FLAG="-v $DATA_PATH:/app/data:Z"
    else
        VOLUME_FLAG="-v $DATA_PATH:/app/data"
    fi
    
    # Run container (Colima uses standard Docker volume mounts)
    $RUNTIME run -d \
        --name $CONTAINER_NAME \
        -p $PORT:13000 \
        -p 13030-13040:13030-13040 \
        $VOLUME_FLAG \
        -e NODE_ENV=production \
        -e PORT=13000 \
        -e AUTO_PORT_SELECTION=false \
        --restart unless-stopped \
        $IMAGE_NAME
    
    echo "✅ Container started successfully"
    echo ""
    echo "📍 AISliDev is running at: http://localhost:$PORT"
    echo "📊 Health check: http://localhost:$PORT/health"
    echo "📂 Data directory: $DATA_PATH (mounted to /app/data)"
    echo ""
    echo "📝 Useful commands:"
    echo "   View logs:    $RUNTIME logs -f $CONTAINER_NAME"
    echo "   Stop:         $RUNTIME stop $CONTAINER_NAME"
    echo "   Restart:      $RUNTIME restart $CONTAINER_NAME"
    echo "   Remove:       $RUNTIME rm $CONTAINER_NAME"
}

# Main deployment flow
main() {
    case "${1:-deploy}" in
        build)
            build_image
            ;;
        deploy)
            build_image
            cleanup_container
            run_container
            ;;
        start)
            run_container
            ;;
        stop)
            echo "🛑 Stopping container: $CONTAINER_NAME"
            $RUNTIME stop $CONTAINER_NAME
            echo "✅ Container stopped"
            ;;
        restart)
            echo "🔄 Restarting container: $CONTAINER_NAME"
            $RUNTIME restart $CONTAINER_NAME
            echo "✅ Container restarted"
            ;;
        logs)
            $RUNTIME logs -f $CONTAINER_NAME
            ;;
        clean)
            cleanup_container
            echo "🗑️  Removing image: $IMAGE_NAME"
            $RUNTIME rmi $IMAGE_NAME 2>/dev/null || true
            echo "✅ Cleanup complete"
            ;;
        *)
            echo "Usage: $0 {build|deploy|start|stop|restart|logs|clean}"
            echo ""
            echo "Commands:"
            echo "  build   - Build container image only"
            echo "  deploy  - Build image and deploy container (default)"
            echo "  start   - Start container (without rebuild)"
            echo "  stop    - Stop container"
            echo "  restart - Restart container"
            echo "  logs    - View container logs"
            echo "  clean   - Remove container and image"
            exit 1
            ;;
    esac
}

main "$@"
