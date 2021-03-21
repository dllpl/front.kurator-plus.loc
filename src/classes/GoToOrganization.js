export default class GoToOrganization {
  constructor(router) {
    this._availableRoles = ['director', 'secretary', 'stream_leader'];
    this._routeNameMap = {
      director: 'director-dashboard',
      secretary: 'secretary-dashboard',
      stream_leader: 'stream_leader-dashboard',
    };
    this._router = router;
  }

  availableRole(relationship) {
    return this._availableRoles.indexOf(relationship.slug) >= 0;
  }

  getRouteName(relationshipName, hideError = false) {
    if (this._routeNameMap.hasOwnProperty(relationshipName)) {
      return this._routeNameMap[relationshipName];
    }
    if (!hideError) {
      console.warn('GoToOrganization: Undefined key in _routeNameMap {' + relationshipName + '}');
    }
  }

  push(organisation, relationship, hideError = false) {
    if (!this.availableRole(relationship) || !this.getRouteName(relationship.slug, hideError)) {
      return null;
    }
    return this._router.push({name: this.getRouteName(relationship.slug), params: {organizationId: organisation.id}}).catch(err => {});
  }
}
