import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import ConnectorsClient from './ConnectorsClient';

// Mock dependencies
vi.mock('@/lib/authContext', () => ({
    useAuth: () => ({
        isLoggedIn: true,
        user: { id: 'test-user', email: 'test@example.com' },
    }),
}));

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

// Mock the child components to avoid deep rendering issues in tests
vi.mock('./LocalUploadView', () => ({
    default: () => <div data-testid="local-upload-mock">Local Upload Content Mock</div>,
}));

// We can mock the tabs to avoid heavy rendering, but it's okay to let them shallow render or crash if not mocked, 
// as long as the test focuses on the layout structure. We'll mock one just in case.
vi.mock('@/components/model-lab/tabs/DriveScanTab', () => ({
    default: () => <div>Drive Scan Tab</div>,
}));

describe('ConnectorsClient Layout & Navigation', () => {
    it('does not render the old left sidebar and hero header', () => {
        render(<ConnectorsClient />);

        // The text from the old sidebar
        const sidebarText = screen.queryByText(/Scan cloud storage for PII/i);
        // The old hero header H1
        const heroHeader = screen.queryByRole('heading', { name: 'Data Connectors', level: 1 });

        // In RED phase, these are present in the DOM, so this test will fail until we remove them!
        expect(sidebarText).not.toBeInTheDocument();
        expect(heroHeader).not.toBeInTheDocument();
    });

    it('navigates between Connectors grid and Local Upload using the buttons', () => {
        render(<ConnectorsClient />);

        // Look for the navigation buttons (they should exist whether in sidebar or top bar)
        // We use queryAllByText because they might contain spans for icons, etc.
        // We look for a button containing the text "Connectors" and "Local Upload"
        const connectorsBtn = screen.getByRole('button', { name: /Connectors/i });
        // Button was renamed from "Local Upload" to "File Handlers" in the UI — same feature.
        const fileHandlersBtn = screen.getByRole('button', { name: /File Handlers/i });

        expect(connectorsBtn).toBeInTheDocument();
        expect(fileHandlersBtn).toBeInTheDocument();

        // Initial state should be Connectors grid
        expect(screen.getByText(/Select a Connector/i)).toBeInTheDocument();
        
        // Local upload view mock should not be visible (it has class 'hidden')
        // In testing-library, hidden elements are still in the DOM, but they might not be visible.
        // However, we can test the class name of their wrapper.
        const gridView = screen.getByText(/Select a Connector/i).closest('div.flex-col');
        expect(gridView).toHaveClass('flex');

        // Click File Handlers
        fireEvent.click(fileHandlersBtn);

        // The Local upload view container should now have 'flex' and grid view should have 'hidden'
        expect(gridView).toHaveClass('hidden');
        const localView = screen.getByTestId('local-upload-mock').closest('div.flex-col');
        expect(localView).toHaveClass('flex');

        // Click Connectors again
        fireEvent.click(connectorsBtn);
        expect(gridView).toHaveClass('flex');
        expect(localView).toHaveClass('hidden');
    });

    // TICKET 1 — Pill order: File Handlers must be first (left), Connectors second (right)
    it('renders File Handlers as the first nav pill and Connectors as the second', () => {
        render(<ConnectorsClient />);

        // getAllByRole returns elements in DOM order — index 0 = first in the document
        const navButtons = screen.getAllByRole('button');
        // The nav container holds exactly the two top-level pills;
        // filter to only the two we care about by their text content
        const pillButtons = navButtons.filter(
            (btn) =>
                btn.textContent?.includes('File Handlers') ||
                btn.textContent?.includes('Connectors')
        );

        // First pill in DOM order must be File Handlers
        expect(pillButtons[0]).toHaveTextContent('File Handlers');
        // Second pill must be Connectors
        expect(pillButtons[1]).toHaveTextContent('Connectors');
    });

    // TICKET 2 — Custom logo replaces UploadCloud on the File Handlers pill
    it('File Handlers pill shows the custom logo (not UploadCloud) ', () => {
        render(<ConnectorsClient />);

        const fileHandlersBtn = screen.getByRole('button', { name: /File Handlers/i });

        // The custom logo renders as an <svg> with data-testid="local-file-uploader-logo"
        const logoSvg = fileHandlersBtn.querySelector('[data-testid="local-file-uploader-logo"]');
        expect(logoSvg).toBeInTheDocument();

        // UploadCloud from lucide renders with a specific class lucide-upload-cloud;
        // it must NOT appear inside the File Handlers button after the swap.
        // ponytail note: active/inactive color inheritance (white vs slate) must be confirmed visually in browser.
        const uploadCloudEl = fileHandlersBtn.querySelector('.lucide-upload-cloud');
        expect(uploadCloudEl).not.toBeInTheDocument();
    });

    // ─── TICKET 3 — Connector Filter Bucket pill row ──────────────────────────

    // T3-1: pill row renders with all 4 pills, all 14 connectors visible by default
    it('shows filter pill row (All/Cloud/Database/Social) and all 14 connectors on initial render', () => {
        render(<ConnectorsClient />);

        // All 4 filter pills must be present
        expect(screen.getByRole('button', { name: /^All$/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /^Cloud$/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /^Database$/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /^Social$/i })).toBeInTheDocument();

        // Default: all 14 connector cards are visible
        // Each ConnectorCard renders exactly one "View Connector" button
        expect(screen.getAllByRole('button', { name: /View Connector/i })).toHaveLength(14);
    });

    // T3-2: Cloud filter — exactly 5 connectors (drive, s3, azure, gcs, glue)
    it('clicking Cloud filter shows exactly 5 connectors', () => {
        render(<ConnectorsClient />);
        fireEvent.click(screen.getByRole('button', { name: /^Cloud$/i }));
        expect(screen.getAllByRole('button', { name: /View Connector/i })).toHaveLength(5);
        // Spot-check a few names that must be visible
        expect(screen.getByText('Google Drive')).toBeInTheDocument();
        expect(screen.getByText('AWS Glue')).toBeInTheDocument();
        // A database connector must NOT appear
        expect(screen.queryByText('MongoDB')).not.toBeInTheDocument();
    });

    // T3-3: Database filter — exactly 5 connectors (database, aws-rds, dynamodb, mongodb, mariadb)
    it('clicking Database filter shows exactly 5 connectors', () => {
        render(<ConnectorsClient />);
        fireEvent.click(screen.getByRole('button', { name: /^Database$/i }));
        expect(screen.getAllByRole('button', { name: /View Connector/i })).toHaveLength(5);
        expect(screen.getByText('MongoDB')).toBeInTheDocument();
        expect(screen.getByText('MariaDB')).toBeInTheDocument();
        // A cloud connector must NOT appear
        expect(screen.queryByText('Google Drive')).not.toBeInTheDocument();
    });

    // T3-4: Social filter — exactly 4 connectors (slack, gmail, zendesk, salesforce)
    it('clicking Social filter shows exactly 4 connectors', () => {
        render(<ConnectorsClient />);
        fireEvent.click(screen.getByRole('button', { name: /^Social$/i }));
        expect(screen.getAllByRole('button', { name: /View Connector/i })).toHaveLength(4);
        expect(screen.getByText('Slack')).toBeInTheDocument();
        expect(screen.getByText('Salesforce')).toBeInTheDocument();
        // A database connector must NOT appear
        expect(screen.queryByText('DynamoDB')).not.toBeInTheDocument();
    });

    // T3-5: clicking All after a filter restores all 14 connectors
    it('clicking All after filtering restores all 14 connectors', () => {
        render(<ConnectorsClient />);
        // Filter down first
        fireEvent.click(screen.getByRole('button', { name: /^Cloud$/i }));
        expect(screen.getAllByRole('button', { name: /View Connector/i })).toHaveLength(5);
        // Then reset
        fireEvent.click(screen.getByRole('button', { name: /^All$/i }));
        expect(screen.getAllByRole('button', { name: /View Connector/i })).toHaveLength(14);
    });
});

describe('ConnectorsClient Dark Mode', () => {
    it('applies dark mode classes to the Top Navigation Bar wrapper', () => {
        render(<ConnectorsClient />);
        // The nav bar wrapper is the first direct child of the root div
        const navWrapper = screen.getByRole('button', { name: /File Handlers/i }).closest('div.border-b');
        expect(navWrapper).toHaveClass('dark:bg-slate-900', 'dark:border-slate-800');
    });

    it('applies dark mode classes to the Grid View wrapper', () => {
        render(<ConnectorsClient />);
        const gridWrapper = screen.getByText(/Select a Connector/i).closest('div.bg-slate-50');
        expect(gridWrapper).toHaveClass('dark:bg-slate-800');
    });

    it('applies dark mode classes to the inactive switcher tabs', () => {
        render(<ConnectorsClient />);
        // By default 'Connectors' is active, so 'File Handlers' is inactive
        const fileHandlersBtn = screen.getByRole('button', { name: /File Handlers/i });
        expect(fileHandlersBtn).toHaveClass('dark:text-slate-400', 'dark:hover:text-white', 'dark:hover:bg-slate-800');
    });

    it('applies inverted CTA styling to the active filter pill', () => {
        render(<ConnectorsClient />);
        // By default 'All' filter is active
        const allPill = screen.getByRole('button', { name: /^All$/i });
        expect(allPill).toHaveClass('dark:bg-white', 'dark:text-slate-900', 'dark:border-white');
    });

    it('applies dark mode classes to inactive filter pills', () => {
        render(<ConnectorsClient />);
        // 'Cloud' filter is inactive by default
        const cloudPill = screen.getByRole('button', { name: /^Cloud$/i });
        expect(cloudPill).toHaveClass('dark:bg-slate-900', 'dark:text-slate-400', 'dark:border-slate-800');
    });

    it('applies dark mode classes to the Connector Cards', () => {
        render(<ConnectorsClient />);
        // Get the first "View Connector" button, which is the CTA inside the card
        const firstCta = screen.getAllByRole('button', { name: /View Connector/i })[0];
        
        // Assert CTA inversion
        expect(firstCta).toHaveClass('dark:bg-white', 'dark:text-slate-900', 'dark:border-white');

        // Check the card wrapper
        const cardWrapper = firstCta.closest('div.group');
        expect(cardWrapper).toHaveClass('dark:bg-slate-900', 'dark:border-slate-800');
    });

    it('applies dark mode classes to the Auth Panel elements', () => {
        render(<ConnectorsClient />);
        
        // Open the Auth Panel by clicking a connector
        const driveCta = screen.getAllByRole('button', { name: /View Connector/i })[0];
        fireEvent.click(driveCta);

        // 1. Auth Grid Wrapper (contains the grid-cols-1 lg:grid-cols-2)
        // It's the parent of the max-w-7xl grid, so we can find the Back to Connectors button and go up
        const backBtn = screen.getByRole('button', { name: /Back to Connectors/i });
        const authGridWrapper = backBtn.closest('div.flex-col.border-b');
        expect(authGridWrapper).toHaveClass('dark:bg-slate-900', 'dark:border-slate-800');

        // 2. Back Button
        expect(backBtn).toHaveClass('dark:text-slate-400', 'dark:hover:text-white');

        // 3. Not Connected Badge
        const notConnectedBadge = screen.getByText(/Not Connected/i).closest('div.border');
        expect(notConnectedBadge).toHaveClass('dark:bg-slate-800', 'dark:text-slate-400', 'dark:border-slate-800');
        
        // 4. Hero Title (Connector)
        const heroTitle = screen.getByRole('heading', { name: 'Connector', level: 1 });
        expect(heroTitle).toHaveClass('dark:text-white');
    });
});
