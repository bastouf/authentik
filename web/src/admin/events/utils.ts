import { EventWithContext } from "@goauthentik/common/events";
import { truncate } from "@goauthentik/common/utils";

import { msg, str } from "@lit/localize";
import { TemplateResult, html } from "lit";

export interface EventGeo {
    city: string;
    country: string;
    continent: string;
    lat: number;
    long: number;
}

export function EventGeoText(event: EventWithContext): TemplateResult {
    let geo: EventGeo | undefined = undefined;
    if (Object.hasOwn(event.context, "geo")) {
        geo = event.context.geo as unknown as EventGeo;
        const parts = [geo.city, geo.country, geo.continent].filter(
            (v) => v !== "" && v !== undefined,
        );
        return html`${parts.join(", ")}`;
    }
    return html``;
}

export function EventUser(event: EventWithContext, truncateUsername?: number): TemplateResult {
    if (!event.user.username) {
        return html`-`;
    }
    let body = html``;
    if (event.user.is_anonymous) {
        body = html`<div>${msg("Anonymous user")}</div>`;
    } else {
        body = html`<div>
            <a href="#/identity/users/${event.user.pk}"
                >${truncateUsername
                    ? truncate(event.user?.username, truncateUsername)
                    : event.user?.username}</a
            >
        </div>`;
    }
    if (event.user.on_behalf_of) {
        body = html`${body}<small>
                <a href="#/identity/users/${event.user.on_behalf_of.pk}"
                    >${msg(str`On behalf of ${event.user.on_behalf_of.username}`)}</a
                >
            </small>`;
    }
    return body;
}
