import pandas as pd

def read_pts(filename: str):
    print('Reading point cloud data')
    f = open(filename)
    num_points = int(f.readline())
    point_data = [line.strip().split() for line in f.readlines()]
    f.close()

    df = pd.DataFrame(
        data=point_data,
        columns=['x', 'y', 'z', 'intensity', 'r', 'g', 'b'],
    )
    df[['x', 'y', 'z']] = df[['x', 'y', 'z']].astype(float)
    df[['intensity', 'r', 'g', 'b']] = df[['intensity', 'r', 'g', 'b']].astype(int)
    df['luminance'] = 0.299*df['r'] + 0.587*df['g'] + 0.114*df['b']

    return df

def write_pts(filename: str, df: pd.DataFrame):
    rows = zip(df['x'], df['y'], df['z'], df['intensity'], df['r'], df['g'], df['b'])

    f = open(filename, 'w')
    f.write(f'{len(df)}\n')
    f.writelines([' '.join(map(str, row)) + '\n' for row in rows])
    f.close()

def write_xyz(filename: str, df: pd.DataFrame):
    rows = zip(df['x'], df['y'], df['z'])

    f = open(filename, 'w')
    f.write(f'{len(df)}\n')
    f.writelines([' '.join(map(str, row)) + '\n' for row in rows])
    f.close()