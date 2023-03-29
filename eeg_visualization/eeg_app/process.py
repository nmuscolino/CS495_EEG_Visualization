import numpy as np
import open3d as o3d
import pandas as pd
from sklearn import cluster
import json


allData = {}


# TODO: could be better if this class was moved to a separate file, maybe in src directory
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


# TODO: Remove? It is doing nothing as of 3/9
class Chunk:
    def __init__(self, sequenceNum, data):
        self.sequenceNum = sequenceNum
        self.data = str(data, 'UTF-8')


def preprocess(pcd_raw):
    # FIXME: This exact function call is used in filter.ipynb, but it results in about 15% as many points here. ????
    pcd = pcd_raw.voxel_down_sample(voxel_size=0.001)  # 1mm

    df = PointCloudDataFrame.from_pcd(pcd)
    df = df[(df['s'] < 0.15) & (df['v'] > 0.2)]
    # TODO: Maybe do outlier removal here?
    return df.to_pcd()


def kmeans_clusters(pcd):
    pcd_filter = preprocess(pcd)
    _, ind = pcd_filter.remove_radius_outlier(nb_points=32, radius=0.005)  # FIXME: change nb_points to 56, once preprocess downsampling is fixed
    pcd_inliers = pcd_filter.select_by_index(ind)

    model = cluster.KMeans(n_clusters=128, n_init='auto')
    model.fit(pcd_inliers.points)

    clusters_dict = {str(i): list(k) for (i, k) in enumerate(model.cluster_centers_)}
    clusters_json = json.dumps(clusters_dict)
    return clusters_json


def dbscan_clusters(pcd):
    pcd_filter = preprocess(pcd)
    _, ind = pcd_filter.remove_radius_outlier(nb_points=56, radius=0.005)
    pcd_inliers = pcd_filter.select_by_index(ind)
    df_inliers = PointCloudDataFrame.from_pcd(pcd_inliers)
   
    model = cluster.DBSCAN(eps=0.002, min_samples=10)
    model.fit(pcd_inliers.points)

    labels = model.labels_ 
    num_labels = len(set(labels).difference({-1}))
    # print(num_labels)

    clusters_dict = {}
    for i in range(num_labels):
        clusters_dict[str(i)]: list(np.mean(df_inliers[labels==i][['x', 'y', 'z']], axis=0))

    clusters_json = json.dumps(clusters_dict)
    return clusters_json


def process_data():
    df = PointCloudDataFrame(allData).update_colors()
    pcd = df.to_pcd()
    coordinates = kmeans_clusters(pcd)
    return coordinates


def add_positions(dataFromPost):
    data = np.frombuffer(dataFromPost, dtype=np.float32).astype(float)
    channel = chr(int(data[0]))
    allData[channel] = data[1:]


def add_colors(dataFromPost):
    data = np.frombuffer(dataFromPost, dtype=np.uint8).astype(int)
    channel = chr(data[0])
    allData[channel] = data[1:]
