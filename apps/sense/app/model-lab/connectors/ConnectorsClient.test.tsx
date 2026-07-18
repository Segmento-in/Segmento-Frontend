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
        const localUploadBtn = screen.getByRole('button', { name: /Local Upload/i });

        expect(connectorsBtn).toBeInTheDocument();
        expect(localUploadBtn).toBeInTheDocument();

        // Initial state should be Connectors grid
        expect(screen.getByText(/Select a Connector/i)).toBeInTheDocument();
        
        // Local upload view mock should not be visible (it has class 'hidden')
        // In testing-library, hidden elements are still in the DOM, but they might not be visible.
        // However, we can test the class name of their wrapper.
        const gridView = screen.getByText(/Select a Connector/i).closest('div.flex-col');
        expect(gridView).toHaveClass('flex');

        // Click Local Upload
        fireEvent.click(localUploadBtn);

        // The Local upload view container should now have 'flex' and grid view should have 'hidden'
        expect(gridView).toHaveClass('hidden');
        const localView = screen.getByTestId('local-upload-mock').closest('div.flex-col');
        expect(localView).toHaveClass('flex');

        // Click Connectors again
        fireEvent.click(connectorsBtn);
        expect(gridView).toHaveClass('flex');
        expect(localView).toHaveClass('hidden');
    });
});
