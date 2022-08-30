import type { NextApiRequest, NextApiResponse } from 'next'
const { GoogleSpreadsheet } = require("google-spreadsheet");

type Data = {
  name: string
}

const getResults = async () => {
  const doc = new GoogleSpreadsheet("1wQ6Rsop9JYp8FmZfJmINFU5IbMHeYp3Zb0YLoi7HE8Q");

  await doc.useServiceAccountAuth({
    client_email: process.env.NEXT_GOOGLE_CLIENT_EMAIL,
    private_key: process.env.NEXT_GOOGLE_PRIVATE_KEY,
  });
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[1];
  await sheet.loadHeaderRow(7);
  await sheet.loadCells();
  const rows = await sheet.getRows({ limit: 1800 });

  const results = [];

  for (let x = 0; x < rows.length; x++) {
    const row = rows[x];
    const tmp = [];

    for (let y = 0; y < row._rawData.length; y++) {
      const value = row._rawData[y];

      tmp.push(value);
    }

    if (tmp[1]) {
      results.push(tmp);
    }
  }

  return results;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<any[][]>
) => {
  const results = await getResults();

  res.status(200).json(results)
}

export default handler;
