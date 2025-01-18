import jsPDF from "jspdf";
import logoImage from "/logo.png";
import { formatDate } from "./dateFormatter";
import { mapNationalityToCountry } from "./nationalitiesMapper"; // Import the mapping function

const addHeader = (doc) => {
  doc.setFont("Times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(4, 4, 252);

  doc.text("EAST AFRICAN COMMUNITY", doc.internal.pageSize.width / 2, 20, {
    align: "center",
  });

  doc.text("SECRETARIAT", doc.internal.pageSize.width / 2, 26, {
    align: "center",
  });

  const logoWidth = 32;
  const logoHeight = 28;
  const logoX = (doc.internal.pageSize.width - logoWidth) / 2;
  doc.addImage(logoImage, "JPEG/PNG", logoX, 29, logoWidth, logoHeight);

  // Left-side contact details
  doc.setFontSize(8);
  doc.setFont("Times", "normal");
  doc.setTextColor(13, 13, 13);
  doc.text("EAC Close, Afrika Mashariki Road,", 30, 39);
  doc.text("P.O. Box 1096", 30, 43);
  doc.text("ARUSHA, TANZANIA", 30, 47);

  // Right-side contact details
  doc.text("Tel: +255-27-2504253/8", doc.internal.pageSize.width - 35, 38, {
    align: "right",
  });
  doc.text(
    "Fax: +255-27-2504255/2504481",
    doc.internal.pageSize.width - 35,
    43,
    {
      align: "right",
    }
  );
  doc.text("Email: eac@eachq.org", doc.internal.pageSize.width - 35, 47, {
    align: "right",
  });
  doc.text("Web: http://www.eac.int", doc.internal.pageSize.width - 35, 51, {
    align: "right",
  });
};

export const generateAcceptanceLetter = (applicantDetails) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const doc = new jsPDF();
  addHeader(doc);

  // Reference and Date
  doc.setFontSize(11);
  doc.setFont("Times", "bold");
  doc.text("Our Ref: F&A/2/2/5", 20, 60);
  doc.text(`Date: ${currentDate}`, 20, 65);

  // Address block
  doc.text(
    `${applicantDetails?.surname} ${applicantDetails?.firstName} ${
      applicantDetails?.otherNames || ""
    }`,
    20,
    75
  );
  doc.text(`${applicantDetails.address || ""}`, 20, 80);
  doc.text(
    `${
      mapNationalityToCountry(applicantDetails.nationality)?.toUpperCase() || ""
    }`,
    20,
    85
  );
  doc.text(`Tel: ${applicantDetails?.phoneNumber || ""}`, 20, 92);

  // Salutation
  doc.text(
    `Dear ${applicantDetails?.surname} ${applicantDetails?.firstName} ${
      applicantDetails?.otherNames || ""
    }`,
    22,
    104
  );

  // Subject line
  const subject =
    "Re: Offer of an Internship at the East African Community Secretariat";
  doc.text(subject, doc.internal.pageSize.width / 2, 111, { align: "center" });

  // Underline the subject
  const textWidth = doc.getTextWidth(subject);
  const startX = (doc.internal.pageSize.width - textWidth) / 2;
  doc.line(startX, 112, startX + textWidth, 112);

  // Body text
  const bodyText = `This is in reference to your internship request application dated ${formatDate(
    applicantDetails.createdAt
  )} received by the East African Community Secretariat.
  
Your Application has been approved and you will be placed under the Department of ${
    applicantDetails.internshipDepartment
  } under the supervision of ${
    applicantDetails.internshipSupervisor || "the assigned supervisor"
  }. This internship takes effect from ${formatDate(
    applicantDetails.internshipStartDate
  )} and expires on ${formatDate(applicantDetails.internshipEndDate)}.
  
However, you should note that the EAC Secretariat does not offer any form of financial assistance to interns. You will therefore, be responsible for your own upkeep including transportation costs to and from the East African Community Offices during the whole period of the internship. When reporting, please carry along original copies of your identification, academic and medical insurance documents submitted during application for verification.`;

  doc.setFont("Times", "normal");
  doc.text(bodyText, 20, 120, { maxWidth: doc.internal.pageSize.width - 40 });

  // Signature section
  doc.text("Yours sincerely,", 20, 180);
  doc.setFont("Times", "bold");
  doc.text("Grace Odongo,", 20, 195);
  doc.text("Principal Human Resource Officer", 20, 200);

  // Acceptance block
  const acceptanceText = `I, __________________________________________________________________________,
  
do hereby accept the internship offer dated ${currentDate} as per the terms and conditions of EAC.`;

  doc.setFont("Times", "normal");
  doc.text(acceptanceText, 20, 210, {
    maxWidth: doc.internal.pageSize.width - 40,
  });
  doc.text(
    "Signature: ______________________ Date: ______________________",
    20,
    235
  );

  return doc.output("dataurlstring");
};

export const generateExtensionLetter = (
  applicantDetails,
  currentEndDate,
  newEndDate,
  extensionReqDate
) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const doc = new jsPDF();
  addHeader(doc);

  // Reference and Date
  doc.setFontSize(11);
  doc.setFont("Times", "bold");
  doc.text("Our Ref: F&A/2/2/5", 20, 60);
  doc.text(`Date: ${currentDate}`, 20, 65);

  // Address block
  doc.text(
    `${applicantDetails?.surname} ${applicantDetails?.firstName} ${
      applicantDetails?.otherNames || ""
    }`,
    20,
    75
  );
  doc.text(`${applicantDetails.address || ""}`, 20, 80);
  doc.text(
    `${
      mapNationalityToCountry(applicantDetails.nationality)?.toUpperCase() || ""
    }`,
    20,
    85
  );
  doc.text(`Tel: ${applicantDetails?.phoneNumber || ""}`, 20, 92);

  // Salutation
  doc.text(
    `Dear ${applicantDetails?.surname} ${applicantDetails?.firstName} ${
      applicantDetails?.otherNames || ""
    }`,
    22,
    104
  );

  // Subject line
  const subject =
    "Re: Extension of Internship period at the East African Community Secretariat";
  doc.text(subject, doc.internal.pageSize.width / 2, 115, { align: "center" });

  // Underline the subject
  const textWidth = doc.getTextWidth(subject);
  const startX = (doc.internal.pageSize.width - textWidth) / 2;
  doc.line(startX, 116, startX + textWidth, 116);

  // Body text
  const bodyText = `This is in reference to your internship extension request dated ${formatDate(
    extensionReqDate
  )} at the East African Community Secretariat.

We are pleased to inform you that your request for an extension has been approved and your internship period has been extended from ${formatDate(
    currentEndDate
  )} to ${formatDate(newEndDate)}.

All other terms and conditions of your internship remain unchanged. You will continue to work under the supervision of ${
    applicantDetails.internshipSupervisor
  } in the ${applicantDetails.internshipDepartment} department.

Please note that this is the final and last internship extension to you. We appreciate your contribution to the EAC Secretariat and hope this extension will provide you with additional valuable experience.`;

  doc.setFont("Times", "normal");
  doc.text(bodyText, 20, 123, { maxWidth: doc.internal.pageSize.width - 40 });

  // Signature section
  doc.text("Yours sincerely,", 20, 180);
  doc.setFont("Times", "bold");
  doc.text("Grace Odongo,", 20, 195);
  doc.text("Principal Human Resource Officer", 20, 200);

  // Acceptance block
  const acceptanceText = `I, __________________________________________________________________________,
  
do hereby accept the internship extension offer dated ${currentDate} as per the terms and conditions of EAC.`;

  doc.setFont("Times", "normal");
  doc.text(acceptanceText, 20, 210, {
    maxWidth: doc.internal.pageSize.width - 40,
  });
  doc.text(
    "Signature: ______________________ Date: ______________________",
    20,
    235
  );

  return doc.output("dataurlstring");
};
