import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.query.slug)
  const { slug } = req.query;
  if (req.query.secret !== process.env.SECRET_TOKEN || !slug || typeof slug === 'string') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  try {
    await res.revalidate(`/${slug.join('/')}`);
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).json({ revalidated: false });
  }
}
