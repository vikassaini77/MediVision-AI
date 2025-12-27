
import torch
import numpy as np

class GradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.gradients = None
        target_layer.register_forward_hook(self._forward_hook)
        target_layer.register_backward_hook(self._backward_hook)

    def _forward_hook(self, module, input, output):
        self.activations = output

    def _backward_hook(self, module, grad_input, grad_output):
        self.gradients = grad_output[0]

    def generate(self):
        weights = self.gradients.mean(dim=(2,3), keepdim=True)
        cam = (weights * self.activations).sum(dim=1).squeeze()
        cam = cam.detach().cpu().numpy()
        cam = np.maximum(cam, 0)
        cam /= cam.max() + 1e-8
        return cam
