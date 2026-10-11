export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const { userInput } = req.body;
  
  try {
    const chain = promptTemplate.pipe(modelWithStructure);
    // The LLM processes the input and returns a validated JSON object
    const generatedJSON = await chain.invoke({ userInput });
    
    // (Optional) Your "Quality Review" step: run a custom validation function here
    // e.g., checkForInfiniteLoops(generatedJSON);
    
    res.status(200).json(generatedJSON);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate workflow" });
  }
}