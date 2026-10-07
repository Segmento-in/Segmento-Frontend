# Ubiquitous Language

Scope: Segmento Sense frontend. Update this file in the same commit as any feature that adds, renames or changes a domain term.

## Data sources

| Term | Definition | Aliases to avoid |
| ---- | ---------- | ---------------- |
| **Connector** | An integration linking Segmento Sense to an external data source such as Google Drive or PostgreSQL. | Integration, connection |
| **Relational Database Connector** | A Connector for SQL databases such as PostgreSQL, MySQL and MariaDB. | SQL Connector, Database |
| **Local Upload** | The internal domain term for scanning files from the user's own device, treated as a pseudo-connector. | File upload, local scan |
| **File Handlers** | The visible UI label of the Local Upload entry point in the Connectors top bar. | Local Upload button, Upload pill |

## Scanning

| Term | Definition | Aliases to avoid |
| ---- | ---------- | ---------------- |
| **Metadata & Sampling Scan** | A combined scan that checks column names and types, then scans a capped sample of rows. | Hybrid scan, mixed scan |
| **Metadata-Only Scan** | A scan that checks column names and types without reading any rows. | Metadata scan, schema scan |
| **Full Load Scan** | A scan that reads rows up to a safety ceiling to find PII. | Deep scan, full scan |
| **Sampling Scan** | A fast scan of a capped sample of rows. | Quick scan, partial scan |
| **Incremental Scan** | A scan of only the records that are new or changed since the last scan. | Delta scan |
| **Model Level Analysis** | A readable explanation of why a piece of data was flagged as PII. | Explainability, reason string |
| **Voting Record** | The list of models or rules that flagged a piece of data. | Contributing models, match source |

## Results and review

| Term | Definition | Aliases to avoid |
| ---- | ---------- | ---------------- |
| **Catalog View** | The table screen for reviewing many scanned files or tables at once; clicking a row opens its result in the Analysis Modal. | Multi-file view, results table |
| **Analysis Modal** | The popup that shows the results of one scanned file or table; its tabs depend on the connector. | Result page, viewer |
| **Entity** | A detected piece of sensitive text with its winning label, saved per scan. | Detection, span |
| **Entities tab** | The Analysis Modal tab that lists Entities and holds the review controls. | Entity list |
| **Entity-capable connector** | A Connector whose results show the Entities tab and review controls. | Review-enabled connector |
| **Flagged Entity** | An Entity the models disagree on: the winning label has half or less of the votes, or the vote is tied. | Needs-review entity, disputed entity |
| **Review Status** | Where an Entity stands in human review: unreviewed, approved (AI label confirmed) or corrected (reviewer chose another label). | Resolution status, tag status |
| **Review Action** | The reviewer's choice on a Flagged Entity: "Correct" confirms the AI label, "Wrong" picks a different label. | Human resolution, manual tag |

## Relationships

- A **Connector** produces scan results that appear in a **Catalog View**; clicking a row opens the **Analysis Modal**.
- The **Analysis Modal** of an **Entity-capable connector** shows the **Entities tab**.
- Each **Entity** has one **Voting Record** and one **Review Status**.
- A **Flagged Entity** waits for a **Review Action**: "Correct" gives status approved, "Wrong" gives status corrected.

## Example dialogue

> **Dev:** "After a PostgreSQL scan, where does the user see the **Entities**?"
> **Domain expert:** "In the **Catalog View** they click the table row. The **Analysis Modal** opens, and because PostgreSQL is an **Entity-capable connector** it shows the **Entities tab**."
> **Dev:** "And a **Flagged Entity** there?"
> **Domain expert:** "The reviewer clicks Correct to confirm the AI label, so the **Review Status** becomes approved. Wrong lets them pick another label, and the status becomes corrected."

## Flagged ambiguities

- The "Correct" button and the "corrected" status are different: Correct gives approved; Wrong gives corrected.
- **Local Upload** and **File Handlers** name the same feature. Use Local Upload in code and docs; File Handlers only as the visible label.
- "Result page" is vague. Say **Catalog View** (many items) or **Analysis Modal** (one item).

## Review coverage (as of 2026-10-06)

Review screen live for Drive, Local Upload, PostgreSQL, MySQL, MariaDB, MongoDB; entities saved by backend but no review screen yet for AWS RDS, DynamoDB, Slack, Gmail, Zendesk, Salesforce; AWS Glue none. This is the only time-sensitive block; update it when a connector gets a review screen.
