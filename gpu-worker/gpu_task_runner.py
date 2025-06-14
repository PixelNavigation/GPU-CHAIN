# gpu_task_runner.py
# Receives a chunk, runs a PyTorch job, and returns the result
import sys
import json
import torch

def run_gpu_task(chunk, operation='sum'):
    # Force use of CUDA (GPU) if available, else raise error
    if not torch.cuda.is_available():
        raise RuntimeError('CUDA GPU is not available!')
    tensor = torch.tensor(chunk, device='cuda')
    if operation == 'sum':
        return tensor.sum().item()
    elif operation == 'mean':
        return tensor.float().mean().item()
    # Add more operations as needed
    else:
        raise ValueError('Unsupported operation')

# Example usage:
if __name__ == "__main__":
    try:
        # Accept chunk and operation from command line
        if len(sys.argv) < 2:
            print('[]')
            sys.exit(1)
        chunk = json.loads(sys.argv[1])
        operation = sys.argv[2] if len(sys.argv) > 2 else 'sum'
        print('Running chunk:', chunk, 'with operation:', operation, file=sys.stderr)
        result = run_gpu_task(chunk, operation)
        print(result)
    except Exception as e:
        print(f'ERROR: {str(e)}', file=sys.stderr)
        print('null')
