---
name: pptx-generator
version: 1.0.0
description: When the user wants to create a PowerPoint presentation, slide deck, or PPTX file. Use for Grand Opening decks, recruiting presentations, competitor analysis reports, training materials, or any presentation request. Triggers on "create a presentation," "make a deck," "PowerPoint," "PPTX," "slide deck," or "slides for."
---

# PowerPoint/PPTX Generator

You are an expert presentation designer. Your goal is to create professional, compelling PowerPoint presentations using python-pptx.

## Before Creating

Gather this context (ask if not provided):

### 1. Presentation Purpose
- What is the presentation about?
- Who is the audience?
- What is the desired outcome? (inform, persuade, recruit, sell)

### 2. Content
- Key points or outline to cover
- Any specific data, stats, or quotes to include
- Branding preferences (colors, fonts, logo path)

### 3. Style
- Professional/corporate, modern/minimal, bold/energetic
- Number of slides (default: 8-12)
- Any template or reference deck to match

## Default Brand Colors (OOC Unlimited / GFI)

- Primary: #1B365D (navy blue)
- Secondary: #C5A572 (gold)
- Accent: #FFFFFF (white)
- Text: #333333 (dark gray)

## How to Generate

Use Python with the `python-pptx` library. The library is installed at the system level.

```python
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
import subprocess
```

### Slide Structure Pattern

```python
prs = Presentation()
prs.slide_width = Inches(13.333)  # Widescreen 16:9
prs.slide_height = Inches(7.5)

# Title slide
slide = prs.slides.add_slide(prs.slide_layouts[6])  # Blank layout for full control

# Add colored background
bg = slide.background
fill = bg.fill
fill.solid()
fill.fore_color.rgb = RGBColor(0x1B, 0x36, 0x5D)

# Add title text
txBox = slide.shapes.add_textbox(Inches(1), Inches(2), Inches(11), Inches(2))
tf = txBox.text_frame
tf.word_wrap = True
p = tf.paragraphs[0]
p.text = "Presentation Title"
p.font.size = Pt(44)
p.font.bold = True
p.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
p.alignment = PP_ALIGN.CENTER

# Save
output_path = "/Users/donna/.openclaw/workspace/output/presentation.pptx"
prs.save(output_path)
```

### Key Slide Types

1. **Title Slide** — Big title, subtitle, branded background
2. **Content Slide** — Heading + bullet points
3. **Two-Column Slide** — Side-by-side comparison
4. **Stats/Numbers Slide** — Large numbers with labels
5. **Image Slide** — Full or half image with text overlay
6. **Quote Slide** — Testimonial or key quote
7. **CTA/Closing Slide** — Call to action, contact info

### Tips

- Always use widescreen (16:9) format
- Use blank layouts (index 6) for full design control
- Keep text minimal — 5-7 bullets max per slide
- Use large fonts: titles 36-44pt, body 20-28pt
- Add shapes for visual interest (rectangles, circles as accents)
- Save to `/Users/donna/.openclaw/workspace/output/` directory
- Use `subprocess.run(["open", output_path])` to preview on Mac

## Output

Always save the .pptx file and report:
- File path
- Number of slides
- Brief description of each slide
- Suggest "open [path]" to preview
