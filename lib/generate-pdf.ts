export async function generatePdf(elementId = "pdf-report"): Promise<void> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const element = document.getElementById(elementId);
  if (!element) throw new Error("PDF element not found");

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#eef1f4",
    logging: false,
    ignoreElements: (el) =>
      el.classList.contains("no-print") || el.classList.contains("print-hide"),
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pageW = 210;
  const pageH = 297;
  const imgW = pageW;
  const imgH = (canvas.height * imgW) / canvas.width;

  let remaining = imgH;
  let offset = 0;

  while (remaining > 0) {
    if (offset > 0) pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, -offset, imgW, imgH);
    offset += pageH;
    remaining -= pageH;
  }

  pdf.save("AI-Readiness-Report.pdf");
}
