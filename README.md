# Welcome to TechStock: Descubre el futuro de la tecnologia

## Project info

**URL of the project**: https://tech-mosaic-ai-shop.lovable.app/

**Architecture**: The stack used in this project was entirely based on Lovable, that is why mostly of front-end and part of the back-end was created using Lovable prompts. Also, I used supabase for supporting the database and some other operations for innovating features using supabase edge functions. There are other technologies implemented to create the ai voice-assistant:
- **Gemini Live:** Used the gemini live API for creating the voice-voice interaction with the user and the ai.
- **Open AI:** For dinamically generating embeddings* of all the products stored in the database.

*The embeddings refering to the coordinates created for each product to create the RAG system for Gemini Live to use to give more accurate and context-aware answers to the user and give recommendations based on the product they are looking at the moment.

**Approach and problem-solving process:** 
My approach was pretty simple. First, what I needed to create was the marketplace as this is going where I will be implementing the AI features. Second, I needed some good mock products to test the MVP, so I used ChatGPT to create 21 products with name, type, company, description, features, stock and price. Third, this information needed to be stored, so here is when Supabase appears to serve as a database of this products. In this case I created a single table called 'Products' where all the information will be stored. Fourth, integrated the Gemini Live API for creating the AI voice-assistant to the marketplace. Fifth, as the AI assistant was not giving accurate answers related to the marketplace, I implemented a RAG system to serve as a contextual-storage which Gemini will use by adding a vector column containing the embeddings of the description of the products. Finally, created an edge function in Supabase used for the AI to generate in real time product recommendations of the product they were looking at the moment (it is mainly focused on giving recommendations based on the price and their characteristics).

I just wanted to add that OpenAI was not creating the embedding values because I do not know how I ran out of the credits, so I had to implement locally a python script that did this process but ideally the project should generate the embedding when a new product is added to the database. 

