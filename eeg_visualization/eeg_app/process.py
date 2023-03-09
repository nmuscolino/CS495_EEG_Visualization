import numpy as np
import open3d as o3d
import pandas as pd
from sklearn import cluster
import json
import os
import struct



allData = [None] * 7

class PointCloudDataFrame(pd.DataFrame):
    @property
    def _constructor(self):
        return PointCloudDataFrame

    @classmethod
    def read_pts(cls, filename: str):
        with open(filename) as f:
            num_points = int(f.readline())
            point_data = [line.strip().split() for line in f.readlines()]

        df = cls(
            data=point_data,
            columns=['x', 'y', 'z', 'intensity', 'r', 'g', 'b'],
        )
        df[['x', 'y', 'z']] = df[['x', 'y', 'z']].astype(float)
        df[['intensity', 'r', 'g', 'b']] = df[['intensity', 'r', 'g', 'b']].astype(int)

        return df.update_colors()

    @classmethod
    def from_pcd(cls, pcd: o3d.geometry.PointCloud):
        df = cls(
            np.concatenate((pcd.points, pcd.colors), axis=1),
            columns=['x', 'y', 'z', 'r', 'g', 'b']
        )
        return df.update_colors()

    def to_pcd(self):
        pcd = o3d.geometry.PointCloud()
        pcd.points = o3d.utility.Vector3dVector(np.asarray(self[['x', 'y', 'z']]))
        pcd.colors = o3d.utility.Vector3dVector(np.asarray(self[['r', 'g', 'b']]))
        return pcd

    def update_colors(self):
        if self['r'].dtype == int:
            self[['r', 'g', 'b']] /= 255

        self['luminance'] = 0.30*self['r'] + 0.59*self['g'] + 0.11*self['b']

        maxc = self[['r', 'g', 'b']].max(axis=1)
        minc = self[['r', 'g', 'b']].min(axis=1)
        diff = maxc - minc
        rc = (maxc-self['r']) / (maxc-minc)
        gc = (maxc-self['g']) / (maxc-minc)
        bc = (maxc-self['b']) / (maxc-minc)

        self['h'] = 0.0
        self['s'] = 0.0
        self['v'] = maxc

        not_gray = (minc != maxc)
        self.loc[not_gray, 's'] = diff.loc[not_gray] / maxc.loc[not_gray]

        rm = not_gray & (self['r'] == maxc)
        self.loc[rm, 'h'] = bc.loc[rm] - gc.loc[rm]
        gm = not_gray & (self['g'] == maxc)
        self.loc[gm, 'h'] = rc.loc[gm] - bc.loc[gm] + 2.0
        bm = not_gray & (self['b'] == maxc)
        self.loc[bm, 'h'] = gc.loc[bm] - rc.loc[bm] + 4.0
        self['h'] = (self['h']/6.0) % 1.0

        return self

    def write_pts(self, filename: str):
        df = self.copy()
        if df['r'].dtype == float:
            df[['r', 'g', 'b']] = round(df[['r', 'g', 'b']] * 255).astype(int)
        if 'intensity' not in df:
            df['intensity'] = 0
    
        rows = df[['x', 'y', 'z', 'intensity', 'r', 'g', 'b']].itertuples(index=False)

        with open(filename, 'w') as f:
            f.write(f'{len(df)}\n')
            f.writelines([' '.join(map(str, row)) + '\n' for row in rows])

    def write_xyz(self, filename: str):
        rows = self[['x', 'y', 'z']].itertuples(index=False)

        with open(filename, 'w') as f:
            f.writelines([' '.join(map(str, row)) + '\n' for row in rows])

class Chunk:
    def __init__(self, sequenceNum, data):
        self.sequenceNum = sequenceNum
        self.data = str(data, 'UTF-8')



def ProcessData(pcd):
    pcd_down = pcd.voxel_down_sample(voxel_size=0.001)  # 1mm
    df = PointCloudDataFrame.from_pcd(pcd_down)
    df_filter1 = df[(df['s'] < 0.075) & (df['v'] > 0.2)]
    pcd_filter1 = df_filter1.to_pcd()
    df_filter2 = df[(df['s'] < 0.075) & (df['v'] > 0.2) & (df['z'] > 0.1)]
    pcd_filter2 = df_filter2.to_pcd()
    _, ind = pcd_filter2.remove_radius_outlier(nb_points=48, radius=0.005)
    pcd_inliers = pcd_filter2.select_by_index(ind)
    pcd_inliers.paint_uniform_color([0.8, 0.8, 0.8])
    model = cluster.KMeans(n_clusters=128, n_init='auto')
    model.fit(pcd_inliers.points)
    dictionary = {str(i): list(k) for (i, k) in enumerate(model.cluster_centers_)}
    json_object = json.dumps(dictionary)
    return json_object

#Ward, can you please make this cleaner by using your class to create the dataframe?
def process_data():
    npAllData = np.concatenate((allData[0], allData[1], allData[2], allData[3], allData[4], allData[5], allData[6]), axis=1)
    df = pd.DataFrame(npAllData[1:,], columns=['x', 'y', 'z', 'l', 'r', 'g', 'b'])
    pcd = o3d.geometry.PointCloud()
    pcd.points = o3d.utility.Vector3dVector(np.asarray(df[['x', 'y', 'z']]))
    pcd.colors = o3d.utility.Vector3dVector(np.asarray(df[['r', 'g', 'b']]))
    coordinates = ProcessData(pcd)
    return coordinates


def add_positions(dataFromPost):
    data = np.frombuffer(dataFromPost, dtype=np.float32)
    data = np.expand_dims(data, 1)
    channel = chr(int(data[0]))

    if channel == 'x':
        allData[0] = data
    elif channel == 'y':
        allData[1] = data
    else:
        allData[2] = data


def add_colors(dataFromPost):
    data = np.frombuffer(dataFromPost, dtype=np.int8)
    channel = chr(data[0]) #This is weird it only works here
    data = np.expand_dims(data, 1)

    if channel == 'l':
        allData[3] = data
    elif channel == 'r':
        allData[4] = data
    elif channel == 'g':
        allData[5] = data
    else:
        allData[6] = data
    
