import numpy as np
import open3d as o3d
import pandas as pd


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
    def read_label(cls, filename: str):
        with open(filename) as f:
            num_points = int(f.readline())
            point_data = [line.strip().split() for line in f.readlines()]

        df = cls(
            data=point_data,
            columns=['x', 'y', 'z', 'r', 'g', 'b', 'label'],
        )
        df[['x', 'y', 'z']] = df[['x', 'y', 'z']].astype(float)
        df[['r', 'g', 'b']] = df[['r', 'g', 'b']].astype(int)
        df['label'].fillna('', inplace=True)
        df[['label']] = df[['label']].astype(str)

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

    def write_label(self, filename: str):
        df = self.copy()
        if df['r'].dtype == float:
            df[['r', 'g', 'b']] = round(df[['r', 'g', 'b']] * 255).astype(int)
        if 'label' not in df:
            df['label'] = ''
    
        rows = df[['x', 'y', 'z', 'r', 'g', 'b', 'label']].itertuples(index=False)

        with open(filename, 'w') as f:
            f.write(f'{len(df)}\n')
            f.writelines([' '.join(map(str, row)) + '\n' for row in rows])
