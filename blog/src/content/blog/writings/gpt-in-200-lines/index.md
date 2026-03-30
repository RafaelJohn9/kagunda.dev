---
title: "What 200 Lines of Code Taught Me About How GPT Actually Thinks"
description: "Turns out intelligence at its core is simpler than you'd expect. Here's what a 200-line GPT shows you when you slow down and look carefully."
pubDate: 2026-03-30
tags: ["gpt", "machine-learning", "transformers", "python", "beginner"]
category: "tutorials"
featured: true
draft: false
---

> **Table of Contents:**
>
> - [Why This Matters](#why-this-matters)
> - [The Big Idea: Predict the Next Token](#the-big-idea-predict-the-next-token)
> - [Step 1: Turning Text Into Numbers](#step-1-turning-text-into-numbers)
> - [Step 2: The Brain  A Tiny Neural Network](#step-2-the-brain--a-tiny-neural-network)
> - [Step 3: Attention  The Secret Sauce](#step-3-attention--the-secret-sauce)
> - [Step 4: Learning  How the Model Improves](#step-4-learning--how-the-model-improves)
> - [Step 5: Training Loop  Repetition Builds Intelligence](#step-5-training-loop--repetition-builds-intelligence)
> - [Step 6: Inference  Making It Talk](#step-6-inference--making-it-talk)
> - [Mental Model Recap](#mental-model-recap)

---

## Why This Matters

Here's a belief most people carry without questioning it: GPT models are impossibly complex. The product of billions of dollars, thousands of researchers, and math so advanced that understanding it is simply not realistic for most people.

That belief is wrong   and it matters that it's wrong.

Because when you believe something is beyond you, you stop trying to understand it. You become a user of the technology instead of someone who can reason about it, critique it, or build with it. And in a world being rapidly reshaped by AI, that's a meaningful disadvantage.

The truth is that GPT has a core idea so simple you can hold it in your head in one sentence. Karpathy's 200-line implementation exists to prove exactly that. This walkthrough will take you through it. By the end, you won't just know *what* the code does. You'll know *why* each piece exists and how they all connect.

---

## The Big Idea: Predict the Next Token

Before we touch any code, we need to lock in the one idea that everything else builds on.

GPT is a next-token predictor.

That's it. The whole thing. When you type a message to ChatGPT and it responds, what's actually happening under the hood is the model predicting one token at a time, over and over, based on everything that came before.

To make that concrete:

```
"hel"
```

What comes next? You'd guess `"l"`. Then `"o"`. Then maybe a space. You've just done what GPT does   you looked at the previous characters and made a probabilistic guess about what follows.

Formally, the model is learning this:

```
P(next_token | previous_tokens)
```

Which reads: "Given what I've seen so far, what's the probability of each possible next character?"

Everything in the 200 lines   the embeddings, the attention mechanism, the optimizer   is in service of learning that one function better and better. Keep that in mind as we go. Every piece we encounter is just another answer to the question: *how do we make that prediction more accurate?*

---

## Step 1: Turning Text Into Numbers

We know the goal now. But there's an immediate practical problem: computers don't understand text. They understand numbers. So the very first thing we need is a way to translate.

Here's the code that handles it:

```python
uchars = sorted(set(''.join(docs)))
BOS = len(uchars)
vocab_size = len(uchars) + 1
```

What's happening here is almost elegant in its simplicity. We scan all the text we have, pull out every unique character, sort them, and assign each one an index. The letter `a` becomes `0`, `b` becomes `1`, and so on. We also add one special token   the Beginning of Sequence marker (`BOS`)   which tells the model where a new name or piece of text starts.

The result is a vocabulary: a complete mapping between the characters our model can work with and the numbers it will actually compute on.

```
a → 0  
b → 1  
c → 2  
...
```

This is called **tokenization**, and in production GPT models it works on chunks of characters called subwords rather than individual letters. But the idea is identical: find a finite set of meaningful units, give each one a number, and now your text is a sequence of integers the model can process.

We've cleared the first hurdle. Text is now math.

---

## Step 2: The Brain  A Tiny Neural Network

With numbers in hand, we can build the model itself. At its core, GPT is a neural network   a function with millions of tunable parameters that takes a sequence of token IDs and outputs a probability distribution over what comes next.

The parameters that matter most at this stage are here:

```python
state_dict = {
    'wte': matrix(vocab_size, n_embd),
    'wpe': matrix(block_size, n_embd),
    'lm_head': matrix(vocab_size, n_embd),
}
```

Let's build an intuition for each one.

`wte` is the **word token embedding** table. Every token in our vocabulary gets a row in this matrix   a list of numbers (a vector) that represents its meaning. At the start of training, these vectors are random. By the end, they've been shaped by the data to capture something real. Words that appear in similar contexts end up with similar vectors.

This is why the word "bank" is so interesting. In isolation, you can't know if it means the edge of a river or a financial institution. But the model doesn't see tokens in isolation   it sees them in context. The embedding for "bank" gets pulled toward the meanings it actually appears with, and the surrounding context fills in the rest.

`wpe` is the **position embedding** table. This one is easy to overlook but crucial. Since our model processes all tokens simultaneously (not one by one like you'd naively imagine), it has no built-in sense of order. The position embedding fixes that. Token at position 0 gets added a certain vector, token at position 1 gets a different one, and so on. Now the model knows not just *what* each token is, but *where* it sits in the sequence.

`lm_head` is the **language model head**   the final layer that converts the model's internal representation back into a probability distribution over the vocabulary. It's what lets the model answer the question: "Given everything I've processed, which token should come next?"

These three components   meaning, position, and prediction   are the skeleton of the model. What gives it real power is what happens in between.

---

## Step 3: Attention  The Secret Sauce

![Image](https://images.openai.com/static-rsc-4/06_5GdZGzJvhs3khexcMB2Cw-uXcLT5xjwmPjsx9rM7CmDvKWN4lTbCPUOY-S3l6a8p8d9mfMDHiQDXFlhcQsWEm6qs9jH0WA1kfxcjK_TH-HzJeDcVouyV79rwhE1Vn9S_sFNNvnNeRkogzCHBRE9KqWTykQ8c1WHZol-R8tJzsWraT4CHqnfP5Qj3OUJiJ?purpose=fullsize)

This is the part that separates transformers from everything that came before them, and the part most people give up on because it sounds technical. It doesn't have to be.

Here's the problem attention is solving.

When you're reading a sentence, you don't give equal weight to every word you've seen. If someone says "The cat sat on the ___", your brain immediately focuses on "cat" as the most relevant prior word. You're not re-reading "The" and "on" and "the" with equal effort   you're selectively attending to what matters.

Attention teaches the model to do the same thing. Here's the code:

```python
q = linear(x, attn_wq)
k = linear(x, attn_wk)
v = linear(x, attn_wv)
```

Three matrices, three roles:

* **Query (Q)**   the current token asking: "What should I be paying attention to?"
* **Key (K)**   every previous token announcing: "Here's what I contain."
* **Value (V)**   every previous token offering: "Here's what I'll give you if you attend to me."

The attention score between two tokens is computed as the dot product of the query and key:

```python
attn_logits = q ⋅ k
attn_weights = softmax(...)
```

If the query and key vectors are well-aligned   pointing in similar directions in the high-dimensional space   the dot product is high. That token gets a high attention weight. Its value gets pulled into the output more heavily.

The final output is a weighted sum of all the value vectors, where the weights are these attention scores. So for the sentence "The cat sat on the ___", the token for "___" ends up heavily influenced by "cat" because their query and key vectors have learned to align on that kind of grammatical relationship.

This is the mechanism that lets the model track long-range dependencies   connecting a pronoun back to the noun it refers to, understanding that a verb's tense affects what comes later, building a coherent picture of meaning across the whole sequence.

---

## Step 4: Learning  How the Model Improves

We have a model that can make predictions. But at the start, those predictions are essentially random   the weights are initialized with noise. So how does the model get good?

This is where the loss function enters:

```python
loss_t = -probs[target_id].log()
```

The loss is a single number that measures how wrong the model was. If the model predicted the correct next token with high probability, the loss is low. If it was confidently wrong, the loss is high. Specifically, this is **cross-entropy loss**, which penalizes the model logarithmically   being wrong by a little is fine, but being very confident about the wrong answer is severely punished.

Now comes the part that makes learning possible: **backpropagation**.

```python
loss.backward()
```

This single line is doing something profound. The `Value` class in Karpathy's code builds a computation graph as the forward pass runs   every operation, every multiplication, every addition is recorded. When we call `.backward()`, it traverses that graph in reverse and applies the chain rule from calculus to compute how much each parameter contributed to the final loss.

Think of it this way: if the model guessed wrong, you want to trace the error back to its source. Which weights led to this bad prediction? How much did each one contribute? Backpropagation answers both questions simultaneously for every single parameter, no matter how many millions there are.

The result is a **gradient** for each weight   a number that says "if you nudge this parameter up, the loss increases by this much." The optimizer then uses those gradients to nudge all the parameters in the direction that reduces the loss.

One wrong prediction, corrected. Now do it a million times.

---

## Step 5: Training Loop  Repetition Builds Intelligence

![Image](https://images.openai.com/static-rsc-4/-3odaRQVJMlgNF1Z3IORt5OFFaGcVmMp9NhH8JwtFD9pbD277j_-WkqiyVQlXWJuK1ZuO6V7-i7OxqQW_NPjQbXNuZ4R1ugkkJ7w6mBelRQcu18PV0lbkaUWNVCrvtRJ6BtsWVzy9TEcNzb0y6mSS-KpEVD2kukNOz9K1K1-9xyQEqJQo6exEXbvLbHWWHkn?purpose=fullsize)

Here's where everything we've built gets put to work:

```python
for step in range(num_steps):
```

Each iteration of this loop is the same four-beat rhythm:

1. Take a batch of text
2. Run the forward pass to predict next tokens
3. Compute the loss
4. Backpropagate and update the weights

Then repeat. A thousand times. Ten thousand times. For GPT-4, hundreds of billions of times on trillions of tokens.

The loop itself is almost insultingly simple. The intelligence doesn't live in the loop   it emerges from repeating this cycle long enough, on enough data, with enough parameters to capture what's being learned.

This pattern should feel familiar. It's how you learned to ride a bike. Try, fall, notice what went wrong, adjust, try again. The model is doing the same thing, just with matrix multiplications instead of balance corrections.

### Adam Optimizer (Smarter Learning)

One important detail: we don't use the raw gradients directly to update the weights. We use the **Adam optimizer**:

```python
m[i] = beta1 * m[i] + (1 - beta1) * p.grad
v[i] = beta2 * v[i] + (1 - beta2) * p.grad ** 2
```

Plain gradient descent is like updating your steering based only on whether you fell *right now*. Adam is smarter   it keeps a running average of past gradients (momentum) and also tracks how much each gradient varies over time (variance). Parameters that have been consistently nudged in one direction get bigger updates. Parameters with noisy, inconsistent gradients get smaller, more cautious updates.

The result is faster, more stable training. The model doesn't oscillate or overshoot   it moves confidently toward lower loss.

---

## Step 6: Inference  Making It Talk

![Image](https://images.openai.com/static-rsc-4/U6q6syi9UyjZ85MNi_EqHzAVAoOc6BPqO74GVasY-llfZxMBarrsvFoK58dJStXP-xhJbqGonqPa1cSxBApyTh7--StGG7HwnJ4QMx0H7WJjbCexTIah5SA5-7omh6HFegTP8sQAkjZotb5qddxO6kmLaItJ65J3EEy-5e8cY_AM3pX_bcfm4BKSplmzSg7A?purpose=fullsize)

Training is over. The weights are set. Now we ask the model to generate something.

This is called inference, and it works like this:

```python
token_id = random.choices(..., weights=probs)
```

We feed the model a starting token (the `BOS` marker). It outputs a probability distribution over the vocabulary. We sample from that distribution   picking a token with probability proportional to how likely the model thinks it is. That token gets appended to the sequence. We feed the new sequence back in. And again.

For Karpathy's name-generation model, trained on a list of names, the output starts looking like:

```
"emma"
"oliver"
"liam"
```

These aren't names from the training data   they're novel combinations of characters that the model has learned are plausible. That's the emergence of generalization: the model has internalized the *patterns* of English names, not just memorized the examples.

### Temperature = Creativity Control

One knob you can turn during inference:

```python
temperature = 0.5
```

Before we sample from the probability distribution, we divide the logits by the temperature. A low temperature (less than 1) makes the distribution sharper   the most likely tokens become even more dominant, and the output is predictable and coherent. A high temperature flattens the distribution   unlikely tokens get a real shot, and the output becomes surprising, weird, sometimes creative.

Low temperature: `"emma"`. High temperature: `"zarvox"`.

Both are valid depending on what you want. Temperature is how you dial between reliable and adventurous.

---

## Mental Model Recap

Before we close, let's compress everything into the mental model you should walk away with. If someone asks you how GPT works, here's the honest, complete answer:

> 1. **Tokenize**   convert text into a sequence of integers
> 2. **Embed**   look up a meaning vector for each token, add a position vector
> 3. **Attend**   let each token look back at previous tokens and decide what to focus on
> 4. **Predict**   output a probability distribution over the vocabulary
> 5. **Learn**   measure how wrong the prediction was, backpropagate, update weights
> 6. **Repeat**   do this thousands of times until the predictions are good

That's the whole loop. Everything else   layer normalization, multiple attention heads, residual connections   is making this loop more stable and scalable. The core is unchanged.

---

## Final Thought

There's something worth sitting with here. A model that generates coherent text, that can continue a sentence, that produces names which sound plausible   all of it emerges from one simple repeated operation: predict the next token, then get corrected.

No programmer wrote the rules for what makes a name sound English. No one encoded grammar. The model discovered all of it from the signal in the loss function alone. Simple feedback, applied consistently, over time, produces something that looks like understanding.

That's not just a lesson about neural networks. It's a pattern you'll find in evolution, in skill acquisition, in how institutions learn and adapt. The mechanism is always the same: try something, measure the result, adjust, repeat.

And now you understand exactly how it works in GPT   not as a user of the technology, but as someone who has looked inside.

*If you can explain this to someone else from memory, you've crossed from "using AI" to actually understanding it.*

---