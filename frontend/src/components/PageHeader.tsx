import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  subtitle?: ReactNode;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
};

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <header className="page-header">
      {breadcrumbs ? (
        <div className="page-header__crumb">{breadcrumbs}</div>
      ) : null}
      <div className="page-header__row">
        <div>
          <h1 className="page-header__title">{title}</h1>
          {subtitle ? (
            <p className="page-header__subtitle">{subtitle}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="page-header__actions">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}
