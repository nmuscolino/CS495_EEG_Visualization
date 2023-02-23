import pandas as pd
import colorsys


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

    df['luminosity'] = df[['r', 'g', 'b']].apply(
        lambda row: colorsys.rgb_to_yiq(*row)[0],
        axis=1,
        result_type='reduce'
    )
    df[['h', 's', 'v']] = df[['r', 'g', 'b']].apply(
        lambda row: colorsys.rgb_to_hsv(*row),
        axis=1,
        result_type='expand'
    )

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