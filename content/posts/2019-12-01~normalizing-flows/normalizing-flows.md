---
title: Normalizing Flows
slug: /normalizing-flows
date: 2019-11-26
cover:
  img: abstract-flow.svg
  source: Vecteezy
  url: https://vecteezy.com/vector-art/277024-abstract-wave-background
tags:
  - HTML5
  - Accessibility
showToc: true
---


I'm a big fan of Feynman's technique of learning something new by trying to explain it to someone else. So in this post, I'll try to explain normalizing flows (NF), a relatively simple yet powerful new tool in statistics for constructing expressive probability distributions from simple base distribution using smooth bijective transformations. It's a hot topic right now and has exciting applications in the context of probabilistic modeling and inference.


## The Big Picture

First, let's take a step back and look at which developments preceded NFs and how they fit into the larger setting of a machine learning subfield known as deep generative models (DGM). There are currently three types of DGMs:


## What are Normalizing Flows?

The problem that normalizing flows aim to address is turning a simple distribution into a complex, multi-modal one in an invertible manner. Why would we want to do that? Training a machine learning model usually means tuning its parameters to maximize the probability of observed training data under the model. To quantify this probability, we have to assume some probability distribution as the model's output. In classification, this is typically a categorical distribution and in regression usually a Gaussian, mostly because it's the only non-uniform continuous distribution we really know how to deal with. However, assuming the model output to be distributed according to a Gaussian is problematic because the world is complicated and the true probability density function (PDF) of actual data will in general be completely unlike a Gaussian.

Luckily, we can take a simple distribution like a Gaussian, sample from it and then transform those samples using smooth bijective functions which essentially performs a change of variables in probability distributions. Repeating this process multiple times can quickly result in a complex PDF for the transformed variable. Danilo Rezende formalized this in [his 2015 paper](https://arxiv.org/abs/1505.05770) on normalizing flows.



## Usage

There are two ways we might want to use a flow model.

For practical applications, depending on which of these we need (and we might need both), we must ensure that certain computational operations can be performed efficiently.
