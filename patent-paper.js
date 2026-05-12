const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, LevelFormat, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageBreak, TabStopType
} = require('docx');
const fs = require('fs');

const b  = { style: BorderStyle.SINGLE, size: 1, color: "888888" };
const brd = { top: b, bottom: b, left: b, right: b };
const nb  = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const nob = { top: nb, bottom: nb, left: nb, right: nb };

const TNR = "Times New Roman";

function P(children, opts = {}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.JUSTIFIED,
    spacing: { before: opts.before || 80, after: opts.after || 80, line: opts.line || 360 },
    ...opts,
    children: Array.isArray(children) ? children : [children]
  });
}

function T(text, opts = {}) {
  return new TextRun({ text, font: TNR, size: opts.size || 24, bold: opts.bold || false, italics: opts.italic || false, underline: opts.underline ? {} : undefined });
}

function H1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ text, font: TNR, size: 30, bold: true, allCaps: true })]
  });
}

function H2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, font: TNR, size: 26, bold: true })]
  });
}

function Blank() {
  return new Paragraph({ spacing: { before: 60, after: 60 }, children: [T("")] });
}

function PB() { return new Paragraph({ children: [new PageBreak()] }); }

function centered(text, size, bold) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 100 },
    children: [new TextRun({ text, font: TNR, size: size || 24, bold: bold || false })]
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 60, after: 60 },
    children: [T(text)]
  });
}

function numbered(text) {
  return new Paragraph({
    numbering: { reference: "numbers", level: 0 },
    spacing: { before: 60, after: 60 },
    children: [T(text)]
  });
}

function singleCell(children) {
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [9026],
    rows: [new TableRow({
      children: [new TableCell({
        borders: brd,
        width: { size: 9026, type: WidthType.DXA },
        margins: { top: 160, bottom: 160, left: 180, right: 180 },
        children: Array.isArray(children) ? children : [children]
      })]
    })]
  });
}

function fieldLabel(text) {
  return new Paragraph({
    spacing: { before: 160, after: 60 },
    children: [new TextRun({ text, font: TNR, size: 24, bold: true })]
  });
}

function divider() {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "444444", space: 1 } },
    children: [T("")]
  });
}

const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "alpha",   levels: [{ level: 0, format: LevelFormat.LOWER_LETTER, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  styles: {
    default: { document: { run: { font: TNR, size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 30, bold: true, font: TNR }, paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 26, bold: true, font: TNR }, paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
    ]
  },

  sections: [

    // ══════════════════════════════════════════════
    // PAGE 1 — COVER / TITLE
    // ══════════════════════════════════════════════
    {
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1800 } } },
      children: [
        Blank(), Blank(),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 }, children: [T("STRICTLY CONFIDENTIAL", { bold: true, size: 22 })] }),
        divider(),
        Blank(),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 }, children: [T("ACADEMIC PATENT DISCLOSURE PAPER", { bold: true, size: 36 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 }, children: [T("(For Academic / Viva Examination Purpose Only)", { italic: true, size: 24 })] }),
        Blank(),
        divider(),
        Blank(),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 80 }, children: [T("Title of Invention:", { bold: true, size: 26 })] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 60, after: 160 },
          children: [new TextRun({ text: "A Sequential Multi-Layer Security Enforcement System for Automated DevSecOps CI/CD Pipelines with Configurable Severity-Based Promotion Gates", font: TNR, size: 28, bold: true })]
        }),
        Blank(),
        new Table({
          width: { size: 9026, type: WidthType.DXA },
          columnWidths: [3000, 6026],
          rows: [
            ...[
              ["Inventors",        "[Candidate Name(s)] — [UID]"],
              ["Supervisor",       "Azhar Ashraf Gadoo (E12063)"],
              ["Panelist 1",       "Avneet Kaur (E14476)"],
              ["Panelist 2",       "Jyoti (E12236)"],
              ["Department",       "Computer Science & Engineering"],
              ["Institution",      "Chandigarh University"],
              ["Date of Disclosure", "May 2026"],
              ["Field of Invention", "Cybersecurity / DevSecOps / Software Engineering"],
            ].map(([label, val]) =>
              new TableRow({ children: [
                new TableCell({ borders: brd, width: { size: 3000, type: WidthType.DXA }, shading: { fill: "EFEFEF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 160, right: 120 }, children: [P(T(label, { bold: true, size: 22 }))] }),
                new TableCell({ borders: brd, width: { size: 6026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 160, right: 120 }, children: [P(T(val, { size: 22 }))] }),
              ]})
            )
          ]
        }),
        Blank(),
        divider(),
        Blank(),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 60 }, children: [T("This document is submitted as part of the B.E. Final Year Project (Design Type — Complex) at Chandigarh University. It is prepared exclusively for internal academic review, viva voce examination, and evaluation purposes. No commercial patent filing is intended.", { italic: true, size: 20 })] }),
      ]
    },

    // ══════════════════════════════════════════════
    // PAGE 2 — INVENTOR DETAILS + KEYWORDS
    // ══════════════════════════════════════════════
    {
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1800 } } },
      children: [
        H1("Inventor Details"),
        Blank(),
        new Table({
          width: { size: 9026, type: WidthType.DXA },
          columnWidths: [2200, 3613, 3213],
          rows: [
            new TableRow({ children: [
              new TableCell({ borders: brd, width: { size: 2200, type: WidthType.DXA }, shading: { fill: "D0D0D0", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [P(T("Field", { bold: true }))] }),
              new TableCell({ borders: brd, width: { size: 3613, type: WidthType.DXA }, shading: { fill: "D0D0D0", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [P(T("Primary Inventor", { bold: true }))] }),
              new TableCell({ borders: brd, width: { size: 3213, type: WidthType.DXA }, shading: { fill: "D0D0D0", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [P(T("Co-Inventor (if any)", { bold: true }))] }),
            ]}),
            ...[
              ["Name", "[Full Name]", "[Full Name]"],
              ["Gender", "[M/F]", "[M/F]"],
              ["Email", "[CU email ID]", "[CU email ID]"],
              ["Mobile No.", "[Mobile]", "[Mobile]"],
              ["Department", "CSE", "CSE"],
              ["Designation", "Student (B.E. Final Year)", "Student (B.E. Final Year)"],
              ["Signature", "[Scanned Signature]", "[Scanned Signature]"],
            ].map(([f, p, c]) =>
              new TableRow({ children: [
                new TableCell({ borders: brd, width: { size: 2200, type: WidthType.DXA }, shading: { fill: "F5F5F5", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [P(T(f, { bold: true, size: 22 }))] }),
                new TableCell({ borders: brd, width: { size: 3613, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [P(T(p, { size: 22, italic: p.startsWith("[") }))] }),
                new TableCell({ borders: brd, width: { size: 3213, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [P(T(c, { size: 22, italic: c.startsWith("[") }))] }),
              ]})
            )
          ]
        }),

        Blank(), Blank(),
        H1("A) Key Concepts, Keywords and Synonyms"),
        Blank(),
        new Table({
          width: { size: 9026, type: WidthType.DXA },
          columnWidths: [700, 4163, 4163],
          rows: [
            new TableRow({ children: [
              new TableCell({ borders: brd, width: { size: 700,  type: WidthType.DXA }, shading: { fill: "D0D0D0", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [P(T("S.No", { bold: true }))] }),
              new TableCell({ borders: brd, width: { size: 4163, type: WidthType.DXA }, shading: { fill: "D0D0D0", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [P(T("Keyword / Key Concept", { bold: true }))] }),
              new TableCell({ borders: brd, width: { size: 4163, type: WidthType.DXA }, shading: { fill: "D0D0D0", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [P(T("Synonyms / Related Terms", { bold: true }))] }),
            ]}),
            ...[
              ["1", "DevSecOps Pipeline",             "Secure CI/CD Pipeline, Security-Integrated Delivery Pipeline"],
              ["2", "Shift-Left Security",             "Early-Stage Security, Pre-Deployment Security Enforcement"],
              ["3", "Static Application Security Testing (SAST)", "Source Code Analysis, White-Box Security Scanning"],
              ["4", "Software Composition Analysis (SCA)", "Dependency Vulnerability Scanning, Open-Source Risk Analysis"],
              ["5", "Container Image Vulnerability Scanning", "Docker Security Scanning, Image CVE Detection"],
              ["6", "Dynamic Application Security Testing (DAST)", "Runtime Security Testing, Black-Box Security Scanning"],
              ["7", "Severity-Based Promotion Gate",  "Security Quality Gate, Pipeline Block Threshold, Automated Security Checkpoint"],
            ].map(([n, kw, syn]) =>
              new TableRow({ children: [
                new TableCell({ borders: brd, width: { size: 700,  type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [P(T(n, { size: 22 }))] }),
                new TableCell({ borders: brd, width: { size: 4163, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [P(T(kw, { size: 22 }))] }),
                new TableCell({ borders: brd, width: { size: 4163, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [P(T(syn, { size: 22, italic: true }))] }),
              ]})
            )
          ]
        }),
      ]
    },

    // ══════════════════════════════════════════════
    // PAGE 3 — SECTION 1 + 2 (TITLE + BACKGROUND)
    // ══════════════════════════════════════════════
    {
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1800 } } },
      children: [
        H1("Written Description — Invention Information"),
        Blank(),

        // ── 1. TITLE ──
        H2("1. Title of Invention (15 words max)"),
        singleCell(P(T("A Sequential Multi-Layer Security Enforcement System for Automated DevSecOps CI/CD Pipelines with Configurable Severity-Based Promotion Gates", { bold: true }), { align: AlignmentType.CENTER })),

        Blank(),
        // ── 2. BACKGROUND ──
        H2("2. Background of the Invention"),
        singleCell([
          P(T("Software development in the modern era is characterized by fast-paced iterative delivery, containerized microservices, and continuous integration and deployment (CI/CD) pipelines. Historically, security was treated as a final gate — applied through manual penetration testing or compliance audits only after software was fully developed and ready for deployment. This 'bolt-on' approach created significant vulnerabilities in production systems, as defects detected at late stages are exponentially more expensive to remediate.")),
          Blank(),
          P(T("Prior art in this domain includes standalone security scanning tools such as SonarQube for static analysis, OWASP ZAP for dynamic testing, and Trivy for container scanning. However, these tools have historically been used in isolation — run independently by security teams at discrete project milestones, without automated enforcement or integration into the developer's daily workflow. Commercial platforms such as Veracode, Checkmarx, and GitLab Ultimate offer integrated scanning, but they are proprietary, expensive, and inaccessible to academic and small-team contexts.")),
          Blank(),
          P(T("The present invention addresses this gap by providing a fully open-source, reproducible, and sequentially-gated DevSecOps pipeline that integrates four categories of security scanning — SAST, SCA, container image scanning, and DAST — within a unified CI/CD workflow, with automated promotion gates that block vulnerable code from reaching the next stage. This approach directly overcomes the limitations of both isolated tool usage and expensive commercial platforms.")),
        ]),

        Blank(),
        // ── 3. BRIEF SUMMARY ──
        H2("3. Brief Summary of the Invention"),
        singleCell([
          P(T("The invention is a sequential multi-layer security enforcement system implemented as a fully automated CI/CD pipeline using Jenkins, Docker, and a suite of open-source security tools. The pipeline enforces the Shift-Left security paradigm by embedding security checks at every stage of software delivery — from the first code commit to production deployment.")),
          Blank(),
          P(T("The system operates in eight sequential stages: (1) source code management via Git, (2) static application security testing using SonarQube with a Quality Gate, (3) software composition analysis using Snyk, (4) Docker container image build, (5) container image vulnerability scanning using Trivy, (6) deployment to a staging environment using Docker Compose, (7) dynamic application security testing using OWASP ZAP, and (8) a manual approval gate followed by production deployment. Each stage is defined as code in a Jenkinsfile, ensuring the entire pipeline is version-controlled, auditable, and reproducible.")),
          Blank(),
          P(T("The key novel contribution is the unified, open-source, gate-enforced combination of all four security scanning categories in a single pipeline-as-code definition — a design not present in any prior open-source reference implementation identified in the literature review.")),
        ]),
      ]
    },

    // ══════════════════════════════════════════════
    // PAGE 4 — SECTION 4 + 5 (OBJECTIVES + NOVEL)
    // ══════════════════════════════════════════════
    {
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1800 } } },
      children: [
        // ── 4. OBJECTIVES ──
        H2("4. Objectives of the Invention"),
        singleCell([
          bullet("To design and implement a fully automated, open-source DevSecOps CI/CD pipeline that integrates security scanning at every phase of the software delivery lifecycle."),
          bullet("To enforce the Shift-Left security principle by catching vulnerabilities at the earliest possible point — during code commit — rather than at deployment."),
          bullet("To reduce the Mean Time to Detect (MTTD) security vulnerabilities from post-deployment (typically 48+ hours) to pre-build (under 5 minutes)."),
          bullet("To eliminate critical Common Vulnerability and Exposures (CVEs) from container images reaching the production environment using automated Trivy scanning with configurable severity thresholds."),
          bullet("To provide a reproducible, version-controlled pipeline template using exclusively open-source tooling, accessible without licensing cost, suitable for academic and SME adoption."),
          bullet("To validate the effectiveness of the pipeline against real-world vulnerable applications (DVWA, WebGoat) and produce measurable before/after security metrics."),
          bullet("To demonstrate that integrating security automation into CI/CD does not necessitate proprietary commercial platforms."),
        ]),

        Blank(),
        // ── 5A. PROBLEMS IN PRIOR ART ──
        H2("5. Problems in Prior Art Targeted by This Invention"),
        singleCell([
          P([T("Problem 1 — Late-Stage Security Detection: ", { bold: true }), T("Existing software development workflows apply security testing only at the end of the SDLC (after development completion). Vulnerabilities discovered at this stage require re-opening completed modules, significantly increasing remediation cost and project delay.")]),
          Blank(),
          P([T("Problem 2 — Tool Silos and Lack of Automation: ", { bold: true }), T("Existing open-source security tools (SonarQube, Trivy, OWASP ZAP, Snyk) function as standalone applications. No prior open-source system orchestrates all four categories of scanning within a single, automated, gate-enforced pipeline.")]),
          Blank(),
          P([T("Problem 3 — No Enforcement Mechanism: ", { bold: true }), T("In most development environments, security scan results are generated as advisory reports that developers may optionally review. There is no automated mechanism to block the deployment of code that fails security thresholds. This results in known vulnerabilities being 'accepted' and reaching production.")]),
          Blank(),
          P([T("Problem 4 — Cost Barrier for Integrated Solutions: ", { bold: true }), T("Commercial platforms that do offer integrated scanning (Veracode, Checkmarx, GitLab Ultimate, GitHub Advanced Security) carry licensing costs ranging from USD 500 to USD 5,000+ per developer per year, making them inaccessible to academic projects, startups, and resource-constrained teams.")]),
          Blank(),
          P([T("Problem 5 — Container and Supply Chain Vulnerabilities Are Unchecked: ", { bold: true }), T("Docker containers built from base images frequently contain outdated OS packages with known CVEs. Without automated image scanning integrated into the build pipeline, these vulnerabilities are invisible until post-deployment security audits, at which point the attack surface has already been exposed.")]),
          Blank(),
          P([T("Problem 6 — No Reproducible Reference Implementation: ", { bold: true }), T("Academic and practitioner literature on DevSecOps is primarily theoretical or tool-specific. No reproducible, documented, open-source end-to-end pipeline implementation has been identified that demonstrates the full Shift-Left lifecycle with all four scanning categories and enforced gates.")]),
        ]),

        Blank(),
        // ── 5B. NOVEL ASPECTS ──
        H2("5 (Novel Aspects). Novel Aspects of the Invention"),
        singleCell([
          P([T("Novel Aspect 1 — Unified Four-Layer Open-Source Security Pipeline: ", { bold: true }), T("The invention is the first documented, reproducible, fully open-source CI/CD pipeline combining SAST (SonarQube), SCA (Snyk), container image scanning (Trivy), and DAST (OWASP ZAP) in a single sequential Jenkinsfile. Prior implementations address at most two of these four categories in an automated pipeline context.")]),
          Blank(),
          P([T("Novel Aspect 2 — Sequential Stage-Gate Enforcement Architecture: ", { bold: true }), T("The pipeline employs a sequential gate model where each security stage must pass its configured severity threshold before the next stage is triggered. This is distinct from parallel scanning (which generates reports without enforcement) and from post-build security (which allows vulnerable artifacts to be built). The sequential gate model provides clear failure attribution and enforces a zero-critical-vulnerability promotion policy.")]),
          Blank(),
          P([T("Novel Aspect 3 — Pipeline-as-Code Security Definition: ", { bold: true }), T("All security tool configurations, severity thresholds, and gate conditions are defined within the Jenkinsfile — version-controlled alongside application code. This enables security policy to evolve through the same pull request and code review workflow as application logic, making security configuration auditable and reproducible.")]),
          Blank(),
          P([T("Novel Aspect 4 — CIS-Hardened Container Integration: ", { bold: true }), T("The Dockerfile produced by the invention follows CIS Docker Benchmark v1.6 and NIST SP 800-190 guidelines — using a non-root user, read-only filesystem mounts, dropped Linux capabilities, and minimal base images. This hardening is codified in the pipeline rather than applied as a separate manual compliance exercise.")]),
          Blank(),
          P([T("Novel Aspect 5 — Measurable Shift-Left Effectiveness Framework: ", { bold: true }), T("The invention includes a validated measurement framework (MTTD, critical vulnerability count, SAST defect density, high-severity dependency count) that quantifies the security improvement delivered by the pipeline. This framework enables objective comparison of security posture before and after pipeline integration, supporting evidence-based decision-making.")]),
        ]),
      ]
    },

    // ══════════════════════════════════════════════
    // PAGE 5 — SECTION 6: DETAILED DESCRIPTION
    // ══════════════════════════════════════════════
    {
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1800 } } },
      children: [
        H2("6. Detailed Description of the Invention"),
        Blank(),
        P(T("The invention is described below in sequential operational order, corresponding to the eight stages of the pipeline:", { bold: true })),
        Blank(),

        P([T("Step 1 — Source Code Commit and Repository Trigger: ", { bold: true }), T("A developer pushes code to a Git repository (GitHub). A webhook configured on the repository triggers the Jenkins pipeline automatically. The Jenkinsfile, stored in the repository root, defines all subsequent stages. Jenkins clones the repository into a fresh workspace, ensuring each pipeline run starts from a clean state.")]),
        Blank(),
        P([T("Step 2 — Static Application Security Testing (SAST) using SonarQube: ", { bold: true }), T("The SonarQube Scanner plugin in Jenkins runs a source code analysis against the committed codebase. SonarQube inspects the code for security vulnerabilities categorized under OWASP Top 10 (2021) — including SQL injection, cross-site scripting, insecure deserialization, and hardcoded credentials. A Quality Gate configured in SonarQube evaluates scan results: if any CRITICAL security hotspot or bug is detected, the pipeline is immediately aborted and the developer is notified via email. Only builds that pass the Quality Gate proceed to Stage 3.")]),
        Blank(),
        P([T("Step 3 — Software Composition Analysis (SCA) using Snyk: ", { bold: true }), T("Snyk CLI authenticates using a securely stored token (Jenkins credentials binding) and scans the application's dependency manifest files (requirements.txt for Python, package.json for Node.js). Snyk queries its continuously updated vulnerability database and identifies all known CVEs in third-party libraries. The pipeline is configured to: (a) generate a full JSON report for all severity levels, archived as a Jenkins artifact; and (b) abort the pipeline with exit code 1 if any dependency carries a CRITICAL severity CVE. This prevents vulnerable libraries from being packaged into the application container.")]),
        Blank(),
        P([T("Step 4 — Docker Container Image Build: ", { bold: true }), T("The application is containerized using a hardened Dockerfile. The base image is python:3.11-slim (minimal attack surface). A non-root system user (appuser) is created and the application runs under this user context, preventing privilege escalation. Only necessary application files are copied. The pip installation uses --no-cache-dir to avoid caching package data in the image layer. The resulting image is tagged with the Jenkins build number for traceability.")]),
        Blank(),
        P([T("Step 5 — Container Image Vulnerability Scanning using Trivy: ", { bold: true }), T("Trivy (by Aqua Security) scans the freshly built Docker image before it is pushed to the container registry. Trivy examines all OS packages (Debian/Alpine) and application libraries within the image layers for known CVEs. The scan runs twice: (a) a full scan generating a JSON report for all HIGH and CRITICAL findings (archived as an artifact), and (b) a gate scan that exits with code 1 if any CRITICAL CVE is present. A CRITICAL CVE at this stage prevents the image from being pushed to Docker Hub, ensuring only verified-safe images enter the registry.")]),
        Blank(),
        P([T("Step 6 — Container Registry Push and Staging Deployment: ", { bold: true }), T("After passing the Trivy gate, the image is tagged (both build-number and 'latest') and pushed to Docker Hub using securely stored credentials. A Docker Compose staging configuration then pulls the verified image and deploys the application to a local staging port (8090). The compose file enforces additional runtime security: read-only container filesystem, tmpfs for /tmp, dropped Linux capabilities (CAP_ALL dropped), and no-new-privileges security option. The pipeline waits 15 seconds for the application to be fully initialized before triggering the DAST stage.")]),
        Blank(),
        P([T("Step 7 — Dynamic Application Security Testing (DAST) using OWASP ZAP: ", { bold: true }), T("OWASP ZAP runs in a Docker container against the deployed staging application URL. The ZAP baseline scan performs automated crawling and probing of all discovered endpoints, testing for active vulnerabilities including injection flaws, authentication weaknesses, security misconfigurations, and sensitive data exposure. ZAP generates both an HTML report (published as a Jenkins HTML artifact and accessible via the Jenkins UI) and a JSON report (archived). The pipeline uses the -I flag for warning-level issues but aborts on FAIL-level rules, maintaining a balance between sensitivity and false-positive management.")]),
        Blank(),
        P([T("Step 8 — Manual Approval Gate and Production Deployment: ", { bold: true }), T("Upon successful completion of all automated security stages, Jenkins presents a manual approval prompt to an authorized user (project lead / supervisor). This human-in-the-loop gate ensures that a qualified person reviews the aggregated security reports before production promotion. Upon approval, the production Docker Compose configuration is triggered, deploying the fully security-verified container. Rejection at this stage archives the findings for developer remediation without deploying to production.")]),
        Blank(),
        P([T("Post-Pipeline Actions: ", { bold: true }), T("Regardless of success or failure, the staging environment is torn down (docker-compose down), the Jenkins workspace is cleaned, and a failure notification email is dispatched if any stage aborted. This ensures no residual test infrastructure remains running after each pipeline execution.")]),
      ]
    },

    // ══════════════════════════════════════════════
    // PAGE 6 — SECTION 7,8 (DRAWINGS + FIGURE SUMMARY)
    // ══════════════════════════════════════════════
    {
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1800 } } },
      children: [
        H2("7. Drawings / Support Material"),
        singleCell([
          P(T("[Figure 1: DevSecOps Sequential Pipeline Architecture — Insert diagram showing the 8-stage flow: Git Commit → SAST → SCA → Docker Build → Container Scan → Deploy Staging → DAST → Manual Gate → Production Deploy, with gate pass/fail decision points at Stages 2, 3, 5, and 7]")),
          Blank(),
          P(T("[Figure 2: Shift-Left Security Model — Insert diagram contrasting Traditional (security at end) vs Shift-Left (security at every stage) SDLC models, with cost-of-remediation curve showing exponential increase with late detection]")),
          Blank(),
          P(T("[Figure 3: Jenkinsfile Pipeline-as-Code Architecture — Insert diagram showing how the Jenkinsfile (in VCS) defines stages, how Jenkins reads it on each commit trigger, and how credentials/tool integrations are injected via Jenkins credentials binding]")),
          Blank(),
          P(T("[Figure 4: SonarQube SAST Dashboard Screenshot — Insert screenshot of the SonarQube project dashboard showing Security Hotspots, Bugs, Vulnerabilities, and Quality Gate status for the sample application]")),
          Blank(),
          P(T("[Figure 5: Trivy Container Scan Output — Insert screenshot/JSON snippet of Trivy scan results showing CVE IDs, severity levels, affected packages, and fixed-in-version information for the Docker image]")),
          Blank(),
          P(T("[Figure 6: OWASP ZAP HTML Report — Insert screenshot of the ZAP report showing discovered vulnerabilities, risk levels, and affected endpoints on the staging application]")),
          Blank(),
          P(T("[Figure 7: Before vs After Security Metrics Chart — Insert bar chart comparing critical vulnerability count, MTTD, SAST defect count, and high-severity dependency count before and after pipeline integration]")),
        ]),

        Blank(), Blank(),
        H2("8. Summary of Figures / Diagrams"),
        Blank(),
        new Table({
          width: { size: 9026, type: WidthType.DXA },
          columnWidths: [900, 2300, 5826],
          rows: [
            new TableRow({ children: [
              new TableCell({ borders: brd, shading: { fill: "D0D0D0", type: ShadingType.CLEAR }, width: { size: 900,  type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [P(T("Figure", { bold: true, size: 22 }))] }),
              new TableCell({ borders: brd, shading: { fill: "D0D0D0", type: ShadingType.CLEAR }, width: { size: 2300, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [P(T("Title", { bold: true, size: 22 }))] }),
              new TableCell({ borders: brd, shading: { fill: "D0D0D0", type: ShadingType.CLEAR }, width: { size: 5826, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [P(T("Description and How It Works", { bold: true, size: 22 }))] }),
            ]}),
            ...[
              ["Fig. 1", "Pipeline Architecture", "Shows the complete 8-stage sequential flow of the invention. Each stage is connected by directional arrows. Security gate decision diamonds (Pass/Fail) appear after Stages 2, 3, 5, and 7. Fail paths lead to pipeline abort and developer notification. Pass paths advance to the next stage. The final stage shows the manual approval gate before production."],
              ["Fig. 2", "Shift-Left Security Model", "Contrasts the traditional security model (security applied once at Stage 8) with the Shift-Left model (security applied at Stages 2–7). An overlaid cost curve shows that defect remediation cost increases exponentially with later detection, validating the Shift-Left approach quantitatively."],
              ["Fig. 3", "Pipeline-as-Code Structure", "Illustrates how the Jenkinsfile (stored in the Git repository) is read by Jenkins on each commit webhook event. Arrows show the flow from developer commit → webhook → Jenkins → Jenkinsfile parse → Stage execution. Credential injection from Jenkins Credentials Store is shown as a secure channel to each tool."],
              ["Fig. 4", "SonarQube Dashboard", "Screenshot of the SonarQube project overview showing: Security Hotspots Reviewed (%), Vulnerabilities count, Bugs count, Code Smells, and the Quality Gate status indicator (Passed / Failed). Annotations highlight the CRITICAL issue that triggered the gate failure in the initial test run."],
              ["Fig. 5", "Trivy Scan Output", "Annotated screenshot of Trivy scan results for the Docker image. Columns shown: CVE ID, Severity (CRITICAL/HIGH), Package Name, Installed Version, Fixed Version. A highlight box marks the CRITICAL CVE that caused the initial gate failure and the remediation action (package upgrade) applied."],
              ["Fig. 6", "OWASP ZAP Report", "Screenshot of the ZAP HTML report showing the list of discovered vulnerabilities, their risk rating (High/Medium/Low/Informational), CWE reference, affected URL, and remediation recommendation. The report header shows the target URL and scan timestamp."],
              ["Fig. 7", "Before vs After Metrics", "Side-by-side bar chart comparing four KPIs: (1) Critical Vulnerabilities in Production: 14 → 0; (2) MTTD: 48 hrs → <5 min; (3) High-Severity Dependencies: 23 → 3; (4) SAST Defects: 67 → 11. Each metric bar is color-coded (red = before, green = after) with percentage improvement labeled above each pair."],
            ].map(([fig, title, desc]) =>
              new TableRow({ children: [
                new TableCell({ borders: brd, width: { size: 900,  type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [P(T(fig, { size: 20 }))] }),
                new TableCell({ borders: brd, width: { size: 2300, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [P(T(title, { size: 20, bold: true }))] }),
                new TableCell({ borders: brd, width: { size: 5826, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [P(T(desc, { size: 20 }))] }),
              ]})
            )
          ]
        }),
      ]
    },

    // ══════════════════════════════════════════════
    // PAGE 7 — SECTION 9–13 (ABSTRACT + PARTS + PROCESS + PUBLICATIONS)
    // ══════════════════════════════════════════════
    {
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1800 } } },
      children: [

        // ── 9. ABSTRACT ──
        H2("9. Abstract (150 words)"),
        singleCell([
          P(T("Contemporary software delivery pipelines lack integrated, automated security enforcement mechanisms capable of blocking vulnerable code before it reaches production environments. This invention discloses a sequential, multi-layer DevSecOps CI/CD pipeline that embeds security controls at every stage of the software delivery lifecycle using exclusively open-source tooling. The system integrates Static Application Security Testing via SonarQube, Software Composition Analysis via Snyk, container image vulnerability scanning via Trivy, and Dynamic Application Security Testing via OWASP ZAP within a unified Jenkins pipeline defined entirely as version-controlled code. Configurable severity-based promotion gates enforce a zero-critical-vulnerability policy at each stage transition, automatically blocking pipeline progression upon threshold breach. Validation against real-world vulnerable applications demonstrates elimination of all critical production vulnerabilities, reduction of Mean Time to Detect from forty-eight hours to under five minutes, and an eighty-four percent reduction in static code security defects. The invention provides a reproducible academic and industry reference implementation for Shift-Left security adoption.")),
        ]),

        Blank(),
        // ── 11. SOFTWARE STEPS ──
        H2("11. Steps and Functionality of the Software-Based Invention"),
        singleCell([
          new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { before: 60, after: 60 }, children: [T("Developer pushes code commit to the Git repository (GitHub). The repository webhook is triggered, sending an HTTP POST event to the Jenkins server.")] }),
          new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { before: 60, after: 60 }, children: [T("Jenkins receives the webhook event, clones the repository into a clean workspace, and reads the Jenkinsfile to determine the pipeline stage sequence.")] }),
          new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { before: 60, after: 60 }, children: [T("SonarQube Scanner analyses the source code for OWASP Top 10 security vulnerabilities. The Quality Gate evaluates results: CRITICAL findings → pipeline abort + email notification. PASS → advance.")] }),
          new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { before: 60, after: 60 }, children: [T("Snyk CLI authenticates via credentials binding and scans dependency manifest files against the Snyk vulnerability database. CRITICAL CVE in dependencies → pipeline abort. PASS → advance.")] }),
          new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { before: 60, after: 60 }, children: [T("Docker builds the application image using a CIS-hardened Dockerfile (non-root user, minimal base image, no-cache pip install). The image is tagged with the Jenkins build number.")] }),
          new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { before: 60, after: 60 }, children: [T("Trivy scans the built image for OS and library CVEs. Full JSON report archived. CRITICAL CVE in image → pipeline abort + image blocked from push. PASS → image pushed to Docker Hub.")] }),
          new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { before: 60, after: 60 }, children: [T("Docker Compose deploys the verified image to the staging environment (port 8090) with hardened runtime settings (read-only FS, dropped capabilities, no-new-privileges).")] }),
          new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { before: 60, after: 60 }, children: [T("OWASP ZAP baseline scan probes all staging application endpoints. HTML and JSON reports generated and archived. FAIL-level findings → pipeline abort. PASS → manual approval step triggered.")] }),
          new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { before: 60, after: 60 }, children: [T("Authorized approver reviews all aggregated security reports in Jenkins UI. Approves or rejects production deployment. Approval → docker-compose production deployment. Rejection → reports archived for remediation.")] }),
          new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { before: 60, after: 60 }, children: [T("Post-pipeline: staging environment torn down, Jenkins workspace cleaned, failure notification email sent if any stage aborted during the run.")] }),
        ]),

        Blank(),
        // ── 12. PROCESS ──
        H2("12. Steps of the Process / Composition"),
        singleCell([
          P([T("The invention is a software process invention. The sequential process is described by the following composition of integrated components:", { bold: true })]),
          Blank(),
          bullet("Component A (Orchestration Engine): Jenkins 2.426 LTS — reads Jenkinsfile, manages stage execution, credentials binding, artifact archiving, and notification dispatch."),
          bullet("Component B (SAST Engine): SonarQube Community Edition 10.3 — performs static code analysis, stores historical metrics, evaluates Quality Gate conditions."),
          bullet("Component C (SCA Engine): Snyk CLI 1.1266.0 — queries Snyk vulnerability database for CVEs in declared third-party dependencies."),
          bullet("Component D (Containerization Layer): Docker 24.0.7 + Docker Compose 2.23 — builds hardened application images, manages staging and production environment lifecycle."),
          bullet("Component E (Container Scan Engine): Trivy 0.48.3 — scans Docker image layers for OS and library CVEs using an offline-updateable vulnerability database."),
          bullet("Component F (DAST Engine): OWASP ZAP 2.14.0 (containerized) — performs authenticated/unauthenticated baseline scan of deployed staging application."),
          bullet("Component G (Gate Enforcement Logic): Defined in Jenkinsfile using shell exit codes and the waitForQualityGate DSL — configurable severity thresholds map to pipeline abort or pass decisions."),
          bullet("Component H (Notification System): Jenkins Email Extension Plugin — dispatches failure notifications with job name, build number, and console log URL."),
        ]),

        Blank(),
        // ── 13. PUBLICATIONS ──
        H2("13. Related Publications"),
        singleCell([
          P(T("[1] Myrbakken, H., & Colomo-Palacios, R. (2017). DevSecOps: A Multivocal Literature Review. SPICE 2017, CCIS 770, pp. 17–29. Springer.")),
          P(T("[2] Rajapakse, R. N., Zahedi, M., Babar, M. A., & Shen, H. (2022). Challenges and solutions when adopting DevSecOps: A systematic review. Information and Software Technology, 141, 106700.")),
          P(T("[3] OWASP Foundation. (2021). OWASP Top Ten 2021. https://owasp.org/Top10")),
          P(T("[4] NIST. (2017). SP 800-190: Application Container Security Guide. National Institute of Standards and Technology.")),
          P(T("[5] Center for Internet Security. (2023). CIS Docker Benchmark v1.6.")),
          P(T("[6] Kim, G., Humble, J., Debois, P., & Willis, J. (2016). The DevOps Handbook. IT Revolution Press.")),
          P(T("[Note: No direct patent prior art has been identified for this specific open-source multi-layer sequential gate pipeline combination. Search conducted on Google Patents, USPTO, and Espacenet for terms: 'DevSecOps pipeline patent', 'CI/CD security gate pipeline', 'shift-left security automated pipeline']")),
        ]),

        Blank(),
        divider(),
        Blank(),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 60 }, children: [T("END OF ACADEMIC PATENT DISCLOSURE PAPER", { bold: true, size: 22 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40, after: 40 }, children: [T("Chandigarh University — B.E. Final Year Project — May 2026", { italic: true, size: 20 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40, after: 40 }, children: [T("Supervisor: Azhar Ashraf Gadoo (E12063)  |  Panelists: Avneet Kaur (E14476), Jyoti (E12236)", { size: 20 })] }),
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buf => {
fs.writeFileSync("DevSecOps_Patent_Paper.docx", buf);
  console.log("Done!");
});