import numpy as np

class Cube:
    def __init__(self, min, max):
        self.min = np.array(min)
        self.max = np.array(max)
        self.mid = (self.min+self.max)/2
        
    def subdivide(self):
        return [
            Cube(self.min, self.mid),
            Cube([self.min[0], self.min[1], self.mid[2]], [self.mid[0], self.mid[1], self.max[2]]),
            Cube([self.min[0], self.mid[1], self.min[2]], [self.mid[0], self.max[1], self.mid[2]]),
            Cube([self.min[0], self.mid[1], self.mid[2]], [self.mid[0], self.max[1], self.max[2]]),
            Cube([self.mid[0], self.min[1], self.min[2]], [self.max[0], self.mid[1], self.mid[2]]),
            Cube([self.mid[0], self.min[1], self.mid[2]], [self.max[0], self.mid[1], self.max[2]]),
            Cube([self.mid[0], self.mid[1], self.min[2]], [self.max[0], self.max[1], self.mid[2]]),
            Cube(self.mid, self.max),
        ]