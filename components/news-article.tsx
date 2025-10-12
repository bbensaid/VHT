"use client";

import { FileText } from "lucide-react";

// Sample article content - in a real app, this would come from an API
const SAMPLE_CONTENT = {
  1: `Vermont is launching a new initiative to expand healthcare access in rural areas. The program will establish mobile health clinics and telehealth services to reach residents in underserved communities.

The initiative aims to address disparities in healthcare access between urban and rural areas of the state. According to health officials, residents in some rural communities must travel over 30 miles to reach the nearest primary care provider.

"This is a critical step toward ensuring all Vermonters have access to quality healthcare, regardless of where they live," said the state's health commissioner. The program will be funded through a combination of state funds and federal grants.`,

  2: `The Green Mountain Care Board has approved a new value-based payment model for primary care providers in Vermont. The model shifts away from fee-for-service payments toward a system that rewards quality of care and patient outcomes.

Under the new model, providers will receive a fixed monthly payment per patient, with additional incentives for meeting quality metrics and improving patient health outcomes. The board believes this approach will help control healthcare costs while improving the quality of care.

The payment model will be implemented gradually, starting with a pilot program involving several healthcare organizations across the state. If successful, it could be expanded to include more providers and specialties.`,

  3: `A recent study published in the Medical Research Journal shows improved health outcomes resulting from Vermont's healthcare reform efforts. The research examined data from the past five years and found significant improvements in several key metrics.

According to the study, the state has seen a 15% reduction in preventable hospital admissions and a 12% increase in the number of residents with a regular primary care provider. The researchers attribute these improvements to the state's focus on preventive care and care coordination.

"Vermont's approach to healthcare reform provides valuable lessons for other states," the study's lead author noted. The research also identified areas for further improvement, including mental health services and substance abuse treatment.`,

  4: `The Vermont Legislature is considering a new healthcare bill aimed at reducing prescription drug costs for residents. The proposed legislation would establish a prescription drug affordability board with the authority to set upper payment limits for certain high-cost medications.

Supporters argue the bill would help make essential medications more affordable for Vermonters, particularly seniors and those with chronic conditions. However, pharmaceutical industry representatives have expressed concerns about potential impacts on innovation and drug availability.

The bill has passed the House and is currently being considered by the Senate Health and Welfare Committee. Public hearings on the legislation are scheduled for next month.`,

  5: `Community health centers across Vermont will receive additional funding through new federal grants announced this week. The funding, totaling $12 million, will support the expansion of services and facilities at existing centers and the establishment of new centers in underserved areas.

The grants will help health centers enhance primary care services, expand mental health and substance abuse treatment programs, and improve facilities and equipment. Officials expect the funding to increase access to care for approximately 25,000 additional Vermonters.

"Community health centers are the backbone of our healthcare safety net," said a spokesperson for the Vermont Department of Health. "This funding will strengthen their ability to serve vulnerable populations throughout the state."`,
};

type NewsArticleData = {
  id: number;
  title: string;
  date: string;
  source: string;
  summary: string;
};

export function NewsArticle({ article }: { article: NewsArticleData | null }) {
  if (!article) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-2 border-b">
          <h3 className="font-medium">Article Details</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="flex flex-col items-center gap-2">
            <FileText className="h-12 w-12" />
            <p>Select an article to view details</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b">
        <h3 className="font-medium">Article Details</h3>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <h2 className="text-xl font-bold mb-2">{article.title}</h2>
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <span>{article.date}</span>
          <span>•</span>
          <span>{article.source}</span>
        </div>
        <p className="text-sm mb-4">{article.summary}</p>
        <div className="prose prose-sm max-w-none">
          {SAMPLE_CONTENT[article.id as keyof typeof SAMPLE_CONTENT]
            .split("\n\n")
            .map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
        </div>
      </div>
    </div>
  );
}
