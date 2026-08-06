import { createRoot } from "react-dom/client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { flushSync } from "react-dom";
import Invoice from "../components/Invoice";

export const downloadInvoice = async (booking: any) => {

    const div = document.createElement("div");

    div.style.position = "fixed";
    div.style.top = "0";
    div.style.left = "0";
    div.style.position = "fixed";
    div.style.left = "-10000px";
    div.style.top = "0";
    div.style.display = "inline-block";

    document.body.appendChild(div);

    const root = createRoot(div);

    flushSync(() => {
        root.render(<Invoice booking={booking} />);
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    const invoice = document.getElementById("invoice");
    console.log(invoice);
    console.log(invoice?.offsetWidth);
    console.log(invoice?.offsetHeight);

    if (!invoice) return;
    const images = invoice.querySelectorAll("img");

    await Promise.all(
        Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();

            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
            });
        })
    );

    const canvas = await html2canvas(invoice, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",

        width: invoice.scrollWidth,
        height: invoice.scrollHeight,

        windowWidth: invoice.scrollWidth,
        windowHeight: invoice.scrollHeight,

        scrollX: 0,
        scrollY: 0,
    });



    // document.body.appendChild(canvas);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = canvas.height * imgWidth / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
        position = -(imgHeight - heightLeft);

        pdf.addPage();

        pdf.addImage(
            imgData,
            "PNG",
            0,
            position,
            imgWidth,
            imgHeight
        );

        heightLeft -= pdfHeight;
    }

    pdf.save(`Invoice-${booking.customerName}.pdf`);
    // window.open(pdf.output("bloburl"));


}

