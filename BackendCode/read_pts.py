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

    return df


def update_with_colors(df: pd.DataFrame):
    if df['r'].dtype == int:
        df[['r', 'g', 'b']] /= 255

    df['luminance'] = 0.30*df['r'] + 0.59*df['g'] + 0.11*df['b']

    maxc = df[['r', 'g', 'b']].max(axis=1)
    minc = df[['r', 'g', 'b']].min(axis=1)
    diff = maxc - minc
    rc = (maxc-df['r']) / (maxc-minc)
    gc = (maxc-df['g']) / (maxc-minc)
    bc = (maxc-df['b']) / (maxc-minc)

    df['h'] = 0.0
    df['s'] = 0.0
    df['v'] = maxc

    not_gray = (minc != maxc)
    df.loc[not_gray, 's'] = diff.loc[not_gray] / maxc.loc[not_gray]

    rm = not_gray & (df['r'] == maxc)
    df.loc[rm, 'h'] = bc.loc[rm] - gc.loc[rm]
    gm = not_gray & (df['g'] == maxc)
    df.loc[gm, 'h'] = rc.loc[gm] - bc.loc[gm] + 2.0
    bm = not_gray & (df['b'] == maxc)
    df.loc[bm, 'h'] = gc.loc[bm] - rc.loc[bm] + 4.0
    df['h'] = (df['h']/6.0) % 1.0

    return df


def write_pts(filename: str, df: pd.DataFrame):
    if df['r'].dtype == float:
        df = df.copy()  # Do not change original data when writing
        df[['r', 'g', 'b']] = round(df[['r', 'g', 'b']]).astype(int)
   
    rows = zip(df['x'], df['y'], df['z'], df['intensity'], df['r'], df['g'], df['b'])

    f = open(filename, 'w')
    f.write(f'{len(df)}\n')
    f.writelines([' '.join(map(str, row)) + '\n' for row in rows])
    f.close()


def write_xyz(filename: str, df: pd.DataFrame):
    rows = zip(df['x'], df['y'], df['z'])

    f = open(filename, 'w')
    f.writelines([' '.join(map(str, row)) + '\n' for row in rows])
    f.close()