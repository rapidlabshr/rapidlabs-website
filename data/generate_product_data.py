import pandas as pd

# ============================
# CONFIGURATION
# ============================

EXCEL_FILE = "bloodtest.xlsx"
OUTPUT_FILE = "product_data.txt"

# ============================
# READ EXCEL
# ============================

df = pd.read_excel(EXCEL_FILE)

# Replace empty values
df = df.fillna("")

lines = []

for _, row in df.iterrows():

    test_id = int(row["id"])
    name = str(row["name"]).replace('"', '\\"')

    # Price
    try:
        price = int(float(row["price"]))
    except:
        price = 0

    # Parameters
    parameters = str(row["parameters"]).strip()

    # Type
    test_type = str(row["type"]).strip()

    # Create Details
    details = f"{parameters} · {test_type}"

    lines.append(
f'''  {test_id}: {{
    name: "{name}",
    price: {price},
    details: "{details}"
  }},'''
    )

# ============================
# WRITE FILE
# ============================

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print("=" * 50)
print("PRODUCT_DATA generated successfully!")
print(f"Total Tests : {len(df)}")
print(f"Output File : {OUTPUT_FILE}")
print("=" * 50)