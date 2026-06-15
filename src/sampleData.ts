import { Paper, CrossPaperAnalysis, IdeationResult, LiteratureReview } from "./types";

export const SAMPLE_PAPERS: Paper[] = [
  {
    id: "vaswani2017",
    title: "Attention Is All You Need",
    authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit", "Llion Jones", "Aidan N. Gomez", "Łukasz Kaiser", "Illia Polosukhin"],
    year: 2017,
    journal: "Advances in Neural Information Processing Systems (NeurIPS)",
    abstractSummary: "Introduces the Transformer, a novel sequence transduction model architecture based entirely on self-attention mechanisms, completely discarding recurrence (RNNs) and convolutions (CNNs). The model achieves superior translation quality, is significantly more parallelizable, and requires drastically less time to train.",
    methodologySummary: "The architecture utilizes a stacked Encoder-Decoder structure. Key components include Multi-Head Self-Attention, which allowed the model to jointly attend to information from different representation subspaces, and Sinusoidal Positional Encodings to inject token sequence order. Residual connections, layer normalization, and position-wise feed-forward networks were placed after attention blocks. Evaluated on WMT English-to-German and English-to-French translation datasets.",
    resultsSummary: "The Transformer achieved state-of-the-art results: 28.4 BLEU on English-to-German (improving by 2.0 BLEU over previous best ensembles) and 41.8 BLEU on English-to-French. It established a training speed that was 100x faster than competitive recurrent or conv-based architectures of that period.",
    limitations: [
      "The self-attention layer has a quadratic computational and memory complexity, O(N²), with respect to sequence length N, making it highly inefficient for long documents.",
      "The architecture throws away convolutional inductive bias, meaning it requires massive amounts of training data to generalize effectively compared to CNNs.",
      "Lacks direct temporal structure, relying entirely on static positional encodings which may struggle to generalize to sequence lengths unseen during training."
    ],
    citation: {
      apa: "Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. Advances in Neural Information Processing Systems, 30, 5998–6008.",
      mla: "Vaswani, Ashish, et al. 'Attention is all you need.' Advances in Neural Information Processing Systems 30 (2017): 5998-6008.",
      bibtex: `@inproceedings{vaswani2017attention,
  title={Attention is all you need},
  author={Vaswani, Ashish and Shazeer, Noam and Parmar, Niki and Uszkoreit, Jakob and Jones, Llion and Gomez, Aidan N and Kaiser, {\\L}ukasz and Polosukhin, Illia},
  booktitle={Advances in Neural Information Processing Systems},
  pages={5998--6008},
  year={2017}
}`
    },
    topics: ["Deep Learning", "Transformers", "NLP", "Self-Attention"],
    fileType: "sample",
    fileName: "attention_is_all_you_need.pdf"
  },
  {
    id: "beltagy2020",
    title: "Longformer: The Long-Document Transformer",
    authors: ["Iz Beltagy", "Matthew E. Peters", "Arman Cohan"],
    year: 2020,
    journal: "arXiv preprint arXiv:2004.05150",
    abstractSummary: "Addresses the O(N²) scaling bottleneck of standard Transformers. It introduces Longformer, which features an attention mechanism that scales linearly with sequence length, making it highly effective for modeling documents of thousands of tokens or more, which are otherwise unmanageable on standard GPUs.",
    methodologySummary: "The authors designed a localized 'sliding window attention' combined with 'dilated attention' to build high-capacity receptive fields with sparse computation patterns. To fit downstream task requirements, they supplemented this with task-specific 'global attention' on pre-defined positions (e.g., the CLS token or question tokens). They evaluated the model on long-text character language modeling (WikiText-103) and QA datasets.",
    resultsSummary: "Longformer consistently outperforms standard RoBERTa on document-level tasks. It handles documents up to 4,096 tokens (an 8x increase over standard BERT's 512-token limit). It achieved state-of-the-art results on WikiText-103 with a BPC of 1.10 and showed high accuracy increases on long-form QA like HotpotQA.",
    limitations: [
      "The sparse sliding-window attention implementation requires highly custom, specialized CUDA kernels, which are not naively supported on standard deep learning platforms and are difficult to optimize.",
      "The linear scaling holds true for attention complexity, but overall memory remains constrained by GPU limits on extremely long passages (>16,000 tokens).",
      "Approximating attention over sliding windows loses the fully interactive global context between all pairs of words, potentially limiting performance on highly non-linear or creative text synthesis."
    ],
    citation: {
      apa: "Beltagy, I., Peters, M. E., & Cohan, A. (2020). Longformer: The long-document transformer. arXiv preprint arXiv:2004.05150.",
      mla: "Beltagy, Iz, Matthew E. Peters, and Arman Cohan. 'Longformer: The long-document transformer.' arXiv preprint arXiv:2004.05150 (2020).",
      bibtex: `@article{beltagy2020longformer,
  title={Longformer: The long-document transformer},
  author={Beltagy, Iz and Peters, Matthew E and Cohan, Arman},
  journal={arXiv preprint arXiv:2004.05150},
  year={2020}
}`
    },
    topics: ["Transformers", "Long Context", "Memory Efficiency", "NLP"],
    fileType: "sample",
    fileName: "longformer_long_documents.pdf"
  },
  {
    id: "dao2022",
    title: "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness",
    authors: ["Tri Dao", "Daniel Y. Fu", "Stefano Ermon", "Atri Rudra", "Christopher Ré"],
    year: 2022,
    journal: "Advances in Neural Information Processing Systems (NeurIPS)",
    abstractSummary: "Identifies that the main bottleneck in Transformer attention is not computational, but rather the memory-read/write overhead of intermediate attention matrices (HBM access). It proposes FlashAttention, an IO-aware exact attention algorithm that tiles the computation, achieving substantial speedups and scaling sequence length to 64k tokens without approximations.",
    methodologySummary: "The authors designed a GPU-SRAM tiling algorithm. Instead of writing the O(N²) attention weight matrix to High Bandwidth Memory (HBM) and reading it back, FlashAttention computes softmax on overlapping blocks, incrementally updating normalization factors. They also leveraged recomputation during backward passes to avoid storing the large attention matrix on disk. Integrated into standard training libraries.",
    resultsSummary: "FlashAttention computes exact self-attention 2–4x faster than standard PyTorch implementations. GPT-2 training was accelerated by 3x. It scales attention lengths up to 64,000 tokens on A100 GPUs, driving superior performance on challenging long-sequence datasets (e.g., path-finding tasks and long document QA).",
    limitations: [
      "FlashAttention does not change the theoretical computational complexity, which remains O(N²); it purely optimizes hardware execution speeds and memory storage access patterns.",
      "Requires low-level hardware optimizations, requiring developers to write complex CUDA or Triton code tailored to specific GPU architectures (SRAM size, core speeds) to achieve benefits.",
      "Mainly yields performance gains on memory-bound workloads (like long-sequence lengths), showing narrower improvements on compute-bound, small-sequence tasks."
    ],
    citation: {
      apa: "Dao, T., Fu, D. Y., Ermon, S., Rudra, A., & Ré, C. (2022). Flashattention: Fast and memory-efficient exact attention with io-awareness. Advances in Neural Information Processing Systems, 35, 16344-16359.",
      mla: "Dao, Tri, et al. 'Flashattention: Fast and memory-efficient exact attention with io-awareness.' Advances in Neural Information Processing Systems 35 (2022): 16344-16359.",
      bibtex: `@inproceedings{dao2022flashattention,
  title={Flashattention: Fast and memory-efficient exact attention with io-awareness},
  author={Dao, Tri and Fu, Daniel Y and Ermon, Stefano and Rudra, Atri and R{\'e}, Christopher},
  booktitle={Advances in Neural Information Processing Systems},
  volume={35},
  pages={16344--16359},
  year={2022}
}`
    },
    topics: ["Transformers", "Hardware Optimization", "Memory Efficiency", "Deep Learning"],
    fileType: "sample",
    fileName: "flash_attention_io_aware.pdf"
  }
];

export const DEFAULT_CROSS_ANALYSIS: CrossPaperAnalysis = {
  commonFindings: [
    {
      topic: "The O(N²) Quadratic Memory Bottleneck",
      description: "All three papers agree that the standard self-attention mechanism in Transformers suffers from the O(N²) high memory and computational bottlenecks, limiting applicability to documents beyond 512 tokens.",
      papers: ["vaswani2017", "beltagy2020", "dao2022"]
    },
    {
      topic: "Longer contexts yield better downstream quality",
      description: "Both Longformer and FlashAttention argue that extending the model's sequence length capacity directly leads to better scores on challenging benchmarks like multi-document QA and pathfinding.",
      papers: ["beltagy2020", "dao2022"]
    },
    {
      topic: "Self-Attention is the Premier Sequence Operator",
      description: "All papers proceed from the premise that the Transformer's self-attention layers outperform recurrence and convolution due to superior parallelizability during training and full temporal cross-contextual access.",
      papers: ["vaswani2017", "beltagy2020", "dao2022"]
    }
  ],
  contradictions: [
    {
      topic: "Sparse Approximation vs. Exact IO-Aware Attention",
      argumentA: "Beltagy et al. (Longformer) claim that to handle long sequences, we MUST approximate self-attention via localized sliding windows and global markers to reduce memory scaling dependencies to linear O(N).",
      paperA: "beltagy2020",
      argumentB: "Dao et al. (FlashAttention) argue that we can retain exact attention with standard O(N²) math. By tiling calculations in fast SRAM and minimizing slow HBM reads/writes, we avoid lossy approximations while maintaining excellent scaling.",
      paperB: "dao2022"
    },
    {
      topic: "Software-level vs. Co-designed Hardware Optimization",
      argumentA: "Vaswani et al. and Beltagy et al. design models primarily at the neural architectural level (layers and sparsity equations, running on default framework abstraction layers).",
      paperA: "vaswani2017",
      argumentB: "Dao et al. claim that neural models cannot be optimized in isolation from hardware limits; memory IO is the true bottleneck, requiring hard GPU architecture co-design.",
      paperB: "dao2022"
    }
  ],
  trends: [
    { year: 2017, topic: "Transformer Architecture & Global Content", weight: 9 },
    { year: 2018, topic: "Model Scale & Massive Pre-training (BERT/GPT)", weight: 7 },
    { year: 2020, topic: "Algorithmic Approximations & Sparse Sliding Windows", weight: 8 },
    { year: 2021, topic: "Linear Complexity & Kernel Approximations (Performer)", weight: 6 },
    { year: 2022, topic: "Hardware IO-Aware Co-Design (FlashAttention & SRAM Truncation)", weight: 9 },
    { year: 2024, topic: "Ring Attention & Megabit-scale Long Sequences", weight: 10 }
  ],
  gaps: [
    {
      gap: "Abstract Non-CUDA-Native Fast Attention Scaling",
      impact: "Current high-performance attention algorithms (e.g., FlashAttention) are deeply coupled with hardware-level CUDA/Triton bindings. Scaling models on Apple Silicon, WebGPU, or edge chips remains extremely sluggish and memory-intensive.",
      opportunities: [
        "Incorporate unified math representations that compile down to standard Metal/WebGPU automatically.",
        "Implement exact tiled algorithms with compiler-agnostic shader systems."
      ]
    },
    {
      gap: "Loss of Global Dynamic Integration in Linear Models",
      impact: "Sparse approximations (like Longformer) scale linearly but often neglect non-local relations, degrading deep semantic coherence in creative writing or broad comparative legal analysis.",
      opportunities: [
        "Develop recurrent-transformer hybrids that maintain sliding window speed while compressing permanent state.",
        "Create dynamic routing-attention pathways that selectively allocate full attention matrices search-style."
      ]
    }
  ]
};

export const DEFAULT_IDEATIONS: IdeationResult = {
  thesisIdeas: [
    {
      title: "MetalAttention: Compiler-Agnostic IO-Aware Exact Attention for Edge devices",
      statement: "How can exact self-attention be computed efficiently on unified memory architectures (Apple Silicon and WebGPU) by drawing from hardware-tiled IO principles without CUDA bindings?",
      rationale: "FlashAttention relies on low-level CUDA controls, which prevents non-NVIDIA local accelerators from modeling very long contexts. This thesis proposes a compiler-level tiling strategy for standard unified caches.",
      methodologyProposal: "Implement block-fused kernels on the Metal Performance Shaders (MPS) frame, compile parallel tile loops in WGSL, and measure sequence length extensions and throughput relative to vanilla PyTorch MPS."
    },
    {
      title: "Dynamic Sparse Routing: Bridging Sparse Sliding Windows and Global Semantic Coherence",
      statement: "Can attention be compiled via multi-scale routing where sparse elements are selected dynamically based on semantic similarity clusters rather than static window sizes?",
      rationale: "Longformer's sliding window is fixed and misses long-range associations. Dynamic semantic grids could combine the O(N) scaling speed of sliding windows with the full-context recall of standard Transformers.",
      methodologyProposal: "Construct a key-centroid routing layer, pre-group tokens into contextual clusters using online scalar quantization, run block attention over the clustered sets, and benchmark of long document QA accuracy."
    }
  ],
  projectIdeas: [
    {
      title: "PaperCluster: Dynamic Literature Topological Map Visualizer",
      description: "A developer tool that ingests folders of local PDFs, extracts embeddings via standard micro-embeddings, and outputs an interactive D3 force-directed topological graph of research overlaps and contradictions.",
      stackSuggestions: ["React", "FastAPI", "D3.js", "Transformers", "SQL-lite"],
      difficulty: "Intermediate"
    },
    {
      title: "WebGPU Transformer Sandbox",
      description: "An entirely in-browser visual sandbox where search researchers can upload small text modules, run custom tiled attention parameters, and step-through intermediate SRAM-HBM cache writes block-by-block.",
      stackSuggestions: ["HTML5 Canvas", "WebGPU API", "React", "TypeScript"],
      difficulty: "Advanced"
    }
  ],
  novelApproaches: [
    {
      title: "IO-Aware Window Dialed Networks (IO-WDN)",
      description: "A clean architectural hybridization that combines Longformer's multi-scale sparse sliding-window layout with FlashAttention's mathematical tiling blocks. By running hardware-level tile loops *exclusively* over localized overlapping sliding structures, it targets extreme sequence boundaries (up to 1,000,000 tokens) with negligible cache friction and exact local precision.",
      parentPapers: ["Longformer: The Long-Document Transformer", "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness"]
    }
  ]
};

export const DEFAULT_LIT_REVIEW: LiteratureReview = {
  focus: "Long-context Attention Mechanisms and Hardware Co-design in Modern Transformers",
  introduction: "In recent years, the Transformer architecture introduced by Vaswani et al. (2017) has established itself as the dominant paradigm in natural language processing and deep learning. However, the fundamental self-attention mechanism is constrained by a quadratic memory and computational complexity, which prevents native scaling to long-document tasks, multi-modal video sequences, and codebases. Overcoming this bottleneck has driven two distinct research waves: algorithmic sparse approximations and hardware-conscious execution optimizations.",
  bodySections: [
    {
      title: "The Quadratic Complexity Obstacle and Sparse Approximations",
      content: "The original formulation of self-attention requires computing an N-by-N similarity matrix where every token attends to every other token (Vaswani et al., 2017). For sequences exceeding thousands of tokens, this O(N²) projection severely congests high bandwidth GPU memory. To address this scaling ceiling, early approaches focused on sparsification algorithms. Beltagy et al. (2020) proposed the Longformer, which utilizes sliding window attention with local receptive fields combined with selective global hooks. While this reduced the attention footprint to linear O(N), the reliance on sparse approximation occasionally filters out long-distance semantic interactions and necessitates complex custom CUDA implementations."
    },
    {
      title: "IO-Aware Co-Design and SRAM Tiling",
      content: "An alternative, highly successful paradigm shifted the focus from algorithmic modifications to the physical underpinnings of hardware. Dao et al. (2022) identified that self-attention is bounded not by floating-point math, but by the memory bandwidth required to read and write intermediate matrices between GPU High Bandwidth Memory (HBM) and fast SRAM cache. By proposing FlashAttention, they introduced a GPU tiling mechanism that computes exact self-attention incrementally in SRAM, bypassing the need to store the massive O(N²) matrix. This IO-aware co-design demonstrates that model architecture speed cannot be decoupled from modern hardware bounds."
    }
  ],
  conclusion: "The synthesis of these historical steps reveals an active tension in deep learning research: whether to approximate the core self-attention operations to fit broad system limitations, or to maintain exact computations via direct hardware optimization. While linear sliding windows are conceptually powerful, they lose fully integrated temporal vectors. Conversely, FlashAttention is bound by native CUDA parameters. A major future opportunity lies in hybrid styles that apply unified, IO-aware exact computation formats directly inside dynamic, hierarchical sparse channels.",
  references: [
    "Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. Advances in Neural Information Processing Systems.",
    "Beltagy, I., Peters, M. E., & Cohan, A. (2020). Longformer: The long-document transformer. arXiv preprint arXiv:2004.05150.",
    "Dao, T., Fu, D. Y., Ermon, S., Rudra, A., & Ré, C. (2022). Flashattention: Fast and memory-efficient exact attention with io-awareness. Advances in Neural Information Processing Systems."
  ]
};
