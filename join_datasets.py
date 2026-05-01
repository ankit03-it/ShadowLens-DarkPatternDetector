import pandas as pd

# # ================================
# # FILE PATHS
# # ================================

file1 = "dataset.csv"          # Kaggle / new dataset
file2 = "text_pattern.csv"     # self collected dataset

# # ================================
# # LOAD DATA
# # ================================

df1 = pd.read_csv(file1)
df2 = pd.read_csv(file2)

# normalize column names
df1.columns = df1.columns.str.strip().str.lower()
df2.columns = df2.columns.str.strip().str.lower()

# # ================================
# # CLEAN CATEGORY COLUMN
# # ================================

# def clean_category(df):
#     if 'pattern category' in df.columns:
#         df['pattern category'] = (
#             df['pattern category']
#             .astype(str)
#             .str.strip()
#             .str.lower()
#         )

#         df['pattern category'] = df['pattern category'].replace({
#             'not dark pattern': 'none',
#             'social proof': 'social_proof',
#             'scarcity': 'fake_scarcity',
#             'urgency': 'fake_urgency'
#         })

#     return df


# df1 = clean_category(df1)
# df2 = clean_category(df2)

# # ================================
# # PRINT BASIC INFO
# # ================================

# print("\n==============================")
# print("📊 DATASET 1 (dataset.csv)")
# print("==============================")

# if 'pattern category' in df1.columns:
#     print("\nClasses:")
#     print(df1['pattern category'].value_counts())
# else:
#     print("❌ No 'pattern category' column found")

# print("\nTotal samples:", len(df1))


# print("\n==============================")
# print("📊 DATASET 2 (text_pattern.csv)")
# print("==============================")

# if 'pattern category' in df2.columns:
#     print("\nClasses:")
#     print(df2['pattern category'].value_counts())
# else:
#     print("❌ No 'pattern category' column found")

# print("\nTotal samples:", len(df2))


# # ================================
# # COMPARE CLASSES
# # ================================

# print("\n==============================")
# print("⚔️ CLASS COMPARISON")
# print("==============================")

# if 'pattern category' in df1.columns and 'pattern category' in df2.columns:

#     set1 = set(df1['pattern category'].unique())
#     set2 = set(df2['pattern category'].unique())

#     print("\nCommon classes:")
#     print(set1 & set2)

#     print("\nOnly in dataset 1:")
#     print(set1 - set2)

#     print("\nOnly in dataset 2:")
#     print(set2 - set1)

# else:
#     print("❌ Cannot compare (missing column)")


# # ================================
# # OPTIONAL: LABEL CHECK
# # ================================

# def check_label(df, name):
#     if 'label' in df.columns:
#         print(f"\n{name} label distribution:")
#         print(df['label'].value_counts())


# check_label(df1, "Dataset 1")
# check_label(df2, "Dataset 2")

# print("\n🔥 Inspection complete.")


# ================================
# CLEAN CATEGORY FUNCTION
# ================================

if 'label' in df2.columns:
    df2 = df2.rename(columns={'label': 'pattern category'})

def normalize_category(df):
    if 'pattern category' not in df.columns:
        return df

    df['pattern category'] = (
        df['pattern category']
        .astype(str)
        .str.strip()
        .str.lower()
    )

    df['pattern category'] = df['pattern category'].replace({

        # unify naming
        'neutral': 'none',
        'not dark pattern': 'none',

        'social proof': 'social_proof',
        'fake scarcity': 'fake_scarcity',
        'fake urgency': 'fake_urgency',

        # merge similar concepts
        'sneaking': 'hidden_subscription',
        'forced action': 'forced_continuity',

    })

    return df


df1 = normalize_category(df1)
df2 = normalize_category(df2)

# ================================
# KEEP ONLY NEEDED COLUMNS
# ================================

df1 = df1[['text', 'pattern category']]
df2 = df2[['text', 'pattern category']]

# ================================
# MERGE
# ================================

df_final = pd.concat([df1, df2], ignore_index=True)

# remove duplicates
df_final = df_final.drop_duplicates(subset=['text'])

# shuffle
df_final = df_final.sample(frac=1, random_state=42).reset_index(drop=True)

# ================================
# SAVE
# ================================

df_final.to_csv("final_data.csv", index=False)

# ================================
# PRINT SUMMARY
# ================================

print("\n🔥 FINAL DATASET CREATED\n")

print("Total samples:", len(df_final))

print("\n📊 FINAL CLASS DISTRIBUTION:")
print(df_final['pattern category'].value_counts())