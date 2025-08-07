import { useCallback, useState } from 'react';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface UseConfirmReturn {
  confirmState: ConfirmState;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  closeConfirm: () => void;
  isLoading: boolean;
}

export const useConfirm = (): UseConfirmReturn => {
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    cancelText: 'Cancelar',
    confirmText: 'Confirmar',
    isOpen: false,
    message: '',
    title: '',
    variant: 'warning',
  });

  const [isLoading, setIsLoading] = useState(false);

  const closeConfirm = useCallback(() => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
    setIsLoading(false);
  }, []);

  const confirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setConfirmState({
          ...options,
          cancelText: options.cancelText || 'Cancelar',
          confirmText: options.confirmText || 'Confirmar',
          isOpen: true,
          onCancel: () => {
            resolve(false);
            closeConfirm();
          },
          onConfirm: () => {
            setIsLoading(true);
            resolve(true);
            // Note: closeConfirm should be called by the component after handling the confirmation
          },
          variant: options.variant || 'warning',
        });
      });
    },
    [closeConfirm]
  );

  return {
    closeConfirm,
    confirm,
    confirmState,
    isLoading,
  };
};
