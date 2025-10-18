import prisma from "@/lib/database/prisma";
import type { BlogPost } from "@prisma/client";

// Initial sample blog posts
const initialBlogPosts = [
  {
    title: "Understanding Vermont's Healthcare Reform Initiatives",
    slug: "understanding-vermont-healthcare-reform",
    content: `# Understanding Vermont's Healthcare Reform Initiatives

Vermont has been at the forefront of healthcare reform in the United States, implementing innovative approaches to improve access, quality, and affordability of healthcare services for its residents.

## Key Initiatives

### Green Mountain Care Board

The Green Mountain Care Board (GMCB) was established in 2011 as an independent group to oversee the development of health care policy in Vermont. The board has regulatory authority over healthcare system costs and has been instrumental in implementing various reform initiatives.

### All-Payer Model

Vermont's All-Payer Model is a unique approach that brings together Medicare, Medicaid, and commercial insurers to pay for healthcare in the same way. This model aims to:

- Shift from fee-for-service to value-based payments
- Improve population health outcomes
- Reduce healthcare costs
- Enhance the patient experience

### Blueprint for Health

The Blueprint for Health is a state-led initiative that works to integrate care across the healthcare spectrum. It focuses on:

- Patient-centered medical homes
- Community health teams
- Self-management support programs
- Health information technology

## Challenges and Opportunities

Despite significant progress, Vermont's healthcare reform efforts face several challenges:

1. **Rural Access**: Ensuring access to healthcare services in rural areas remains difficult
2. **Workforce Shortages**: Addressing shortages of healthcare providers, particularly in primary care
3. **Cost Containment**: Continuing to control healthcare costs while maintaining quality
4. **Integration**: Further integrating physical health, mental health, and substance use disorder services

## Looking Ahead

As Vermont continues its healthcare reform journey, several opportunities exist:

- Expanding telehealth services to reach underserved populations
- Strengthening primary care infrastructure
- Enhancing data analytics capabilities to drive improvement
- Developing innovative payment models that reward value over volume

Vermont's experience offers valuable lessons for other states considering healthcare reform initiatives. By focusing on collaboration, innovation, and a commitment to improving population health, Vermont continues to lead the way in transforming healthcare delivery and financing.`,
    excerpt:
      "An overview of the key healthcare reform initiatives in Vermont and their impact on residents and providers.",
    authorId: null,
    published: true,
  },
  {
    title: "The Role of Green Mountain Care Board in Healthcare Policy",
    slug: "role-of-green-mountain-care-board",
    content: `# The Role of Green Mountain Care Board in Healthcare Policy

The Green Mountain Care Board (GMCB) plays a pivotal role in shaping healthcare policy in Vermont. Established in 2011, the board serves as an independent regulatory entity with broad authority over the state's healthcare system.

## Board Composition and Structure

The GMCB consists of five members appointed by the governor and confirmed by the state senate. Members serve six-year terms and bring diverse expertise in healthcare policy, finance, and delivery systems. The board is supported by a professional staff with backgrounds in data analysis, law, and healthcare administration.

## Key Responsibilities

### Rate Review

One of the GMCB's primary functions is reviewing and approving health insurance premium rates. This process involves:

- Analyzing proposed rate increases from insurers
- Evaluating the reasonableness of administrative costs
- Assessing the impact on consumers and the market
- Making adjustments to ensure rates are fair and affordable

### Hospital Budget Review

The board has authority to review and approve hospital budgets, which includes:

- Setting targets for hospital revenue growth
- Evaluating capital expenditure plans
- Monitoring compliance with approved budgets
- Implementing corrective actions when necessary

### Certificate of Need

The GMCB oversees the certificate of need (CON) process, which requires healthcare facilities to obtain approval before making significant capital investments or offering new services. This helps prevent unnecessary duplication of services and controls healthcare costs.

### All-Payer Model Implementation

The board plays a central role in implementing Vermont's All-Payer Model, which aims to align payment methodologies across Medicare, Medicaid, and commercial insurers. This includes:

- Setting quality and cost targets
- Monitoring performance metrics
- Adjusting payment methodologies as needed
- Reporting outcomes to state and federal partners

## Impact on Healthcare Reform

The GMCB has contributed significantly to Vermont's healthcare reform efforts by:

1. **Controlling Costs**: Through rate review and budget oversight, the board has helped moderate healthcare cost growth
2. **Improving Transparency**: Public hearings and data reporting have enhanced transparency in healthcare pricing and quality
3. **Promoting Innovation**: The board has supported pilot programs and payment reforms that incentivize value over volume
4. **Enhancing Coordination**: By aligning incentives across payers, the GMCB has fostered greater coordination in the healthcare system

## Challenges and Criticisms

Despite its accomplishments, the GMCB faces several challenges:

- Balancing regulatory oversight with market flexibility
- Addressing the unique needs of rural providers
- Coordinating with other state and federal agencies
- Measuring and demonstrating the impact of its policies

## Future Directions

Looking ahead, the GMCB is likely to focus on:

- Further integration of mental health and substance use disorder services
- Expanding value-based payment models
- Addressing healthcare workforce shortages
- Leveraging data analytics to drive improvement

The Green Mountain Care Board remains a cornerstone of Vermont's approach to healthcare reform, serving as a model for other states seeking to enhance regulatory oversight and promote system-wide transformation.`,
    excerpt:
      "Exploring how the Green Mountain Care Board shapes healthcare policy and ensures quality care for Vermonters.",
    authorId: null, // Will be set when user system is implemented
    published: true,
  },
  {
    title: "Medicaid Expansion: Benefits and Challenges",
    slug: "medicaid-expansion-benefits-challenges",
    content: `# Medicaid Expansion: Benefits and Challenges

Medicaid expansion has been a cornerstone of healthcare reform efforts in Vermont and across the United States. This analysis examines the benefits, challenges, and future outlook of Medicaid expansion in Vermont.

## Background

Medicaid is a joint federal-state program that provides health coverage to eligible low-income adults, children, pregnant women, elderly adults, and people with disabilities. The Affordable Care Act (ACA) of 2010 expanded Medicaid eligibility to include adults with incomes up to 138% of the federal poverty level.

Vermont was one of the first states to implement Medicaid expansion, beginning in 2014. The state had already established a strong foundation for public health insurance through its Vermont Health Access Plan (VHAP) and other programs.

## Benefits of Medicaid Expansion

### Increased Coverage

Medicaid expansion has significantly reduced the uninsured rate in Vermont. Prior to expansion, approximately 7% of Vermonters lacked health insurance. By 2019, this rate had dropped to less than 4%, one of the lowest in the nation.

### Improved Health Outcomes

Research has shown that Medicaid expansion is associated with:

- Earlier detection of chronic conditions
- Improved management of diabetes, hypertension, and other chronic diseases
- Reduced mortality rates
- Increased access to mental health and substance use disorder treatment

### Economic Benefits

Medicaid expansion has provided economic benefits to Vermont, including:

- Increased federal funding flowing into the state
- Reduced uncompensated care costs for hospitals
- Job creation in the healthcare sector
- Improved financial security for low-income families

### Rural Healthcare Support

In rural areas of Vermont, Medicaid expansion has helped sustain healthcare facilities that might otherwise struggle financially. This has preserved access to care in underserved communities.

## Challenges

### Fiscal Sustainability

While the federal government initially covered 100% of the costs for newly eligible Medicaid enrollees, this match has gradually decreased to 90%. Vermont must allocate state funds to cover the remaining 10%, which presents budgetary challenges.

### Provider Participation

Medicaid reimbursement rates are typically lower than those of private insurance, which can discourage provider participation. This can limit access to care for Medicaid beneficiaries, particularly for specialty services.

### Administrative Complexity

The Medicaid program involves complex eligibility rules, enrollment procedures, and reporting requirements. This administrative burden affects both the state and healthcare providers.

### Workforce Shortages

Vermont faces healthcare workforce shortages, particularly in primary care, mental health, and certain specialties. Medicaid expansion has increased demand for services, exacerbating these shortages.

## Future Outlook

As Vermont continues to implement and refine Medicaid expansion, several key considerations will shape its future:

### Integration with Payment Reform

Vermont is working to integrate Medicaid into broader payment reform initiatives, such as the All-Payer Model. This aims to align incentives across payers and promote value-based care.

### Addressing Social Determinants of Health

There is growing recognition that health outcomes are influenced by social factors such as housing, food security, and transportation. Future Medicaid initiatives may incorporate strategies to address these social determinants of health.

### Telehealth Expansion

The COVID-19 pandemic accelerated the adoption of telehealth services. Continued expansion of telehealth could improve access to care for Medicaid beneficiaries, particularly in rural areas.

### Federal Policy Changes

Changes in federal Medicaid policy could significantly impact Vermont's program. The state must remain adaptable to potential changes in funding, eligibility requirements, or program structure.

## Conclusion

Medicaid expansion has been a transformative component of Vermont's healthcare reform efforts, significantly reducing the uninsured rate and improving access to care. While challenges remain, particularly related to fiscal sustainability and workforce capacity, the program continues to evolve to meet the healthcare needs of Vermonters.

The experience of Vermont offers valuable insights for other states considering or implementing Medicaid expansion, highlighting both the benefits and the ongoing challenges of expanding public health insurance coverage.`,
    excerpt:
      "A detailed analysis of Medicaid expansion in Vermont, including its benefits, challenges, and future outlook.",
    authorId: null,
    published: true,
  },
  {
    title: "Rural Healthcare Access in Vermont",
    slug: "rural-healthcare-access-vermont",
    excerpt:
      "Examining the challenges of healthcare access in rural Vermont communities and potential solutions.",
    authorId: null,
    published: true,
    content: "Content for rural healthcare access article...",
  },
  {
    title: "Value-Based Payment Models in Vermont",
    slug: "value-based-payment-models-vermont",
    excerpt:
      "How value-based payment models are transforming healthcare delivery and financing in Vermont.",
    authorId: null,
    published: true,
    content: "Content for value-based payment models article...",
  },
];

/**
 * Service for managing blog posts
 */
export class BlogService {
  /**
   * Seed initial blog posts if database is empty
   */
  private static async seedInitialDataIfNeeded() {
    const count = await prisma.blogPost.count();
    if (count === 0) {
      await prisma.blogPost.createMany({
        data: initialBlogPosts,
      });
    }
  }

  /**
   * Get all blog posts
   */
  static async getBlogPosts(): Promise<BlogPost[]> {
    await this.seedInitialDataIfNeeded();

    return prisma.blogPost.findMany({
      include: {
        author: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get a blog post by slug
   */
  static async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    await this.seedInitialDataIfNeeded();

    return prisma.blogPost.findUnique({
      where: { slug: slug.toLowerCase().trim() },
      include: {
        author: true,
      },
    });
  }

  /**
   * Get a blog post by ID
   */
  static async getBlogPostById(id: string): Promise<BlogPost | null> {
    await this.seedInitialDataIfNeeded();

    return prisma.blogPost.findUnique({
      where: { id },
    });
  }

  /**
   * Add a new blog post
   */
  static async addBlogPost(
    title: string,
    slug: string,
    content: string,
    excerpt = "",
    authorId?: string,
    published = false
  ): Promise<BlogPost> {
    return prisma.blogPost.create({
      data: {
        title,
        slug: slug.toLowerCase().trim(),
        content,
        excerpt,
        authorId,
        published,
      },
    });
  }

  /**
   * Update a blog post
   */
  static async updateBlogPost(
    id: string,
    data: Partial<BlogPost>
  ): Promise<BlogPost> {
    // If slug is being updated, ensure it's lowercase and trimmed
    if (data.slug) {
      data.slug = data.slug.toLowerCase().trim();
    }

    return prisma.blogPost.update({
      where: { id },
      data,
    });
  }

  /**
   * Remove a blog post by ID
   */
  static async removeBlogPost(id: string): Promise<void> {
    await prisma.blogPost.delete({
      where: { id },
    });
  }
}
