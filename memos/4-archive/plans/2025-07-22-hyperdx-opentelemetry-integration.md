# HyperDX + OpenTelemetry Integration Implementation Memo

**Date:** 2025-07-22\
**Author:** Claude Code\
**Status:** Draft

## Overview

Implementation plan for integrating HyperDX observability platform with
OpenTelemetry in our Kamal/Hetzner/GitHub Actions deployment pipeline. This will
provide unified monitoring for logs, metrics, traces, and session replays across
our Deno/TypeScript applications.

## Current State Analysis

### Existing Infrastructure

- **Deployment**: Kamal 2.x on Hetzner Cloud
- **Runtime**: Deno 2.x with TypeScript
- **CI/CD**: GitHub Actions
- **Current Observability**: Basic log forwarding to HyperDX
- **Partial HyperDX Setup**: Basic log forwarding configured in `deploy.yml.tpl`

### Already Configured

```yaml
# In infra/terraform/hetzner/deploy.yml.tpl
logging:
  driver: fluentd
  options:
    fluentd-address: tls://in-otel.hyperdx.io:24225
    labels: "__HDX_API_KEY,service.name"

labels:
  __HDX_API_KEY: ${hyperdx_api_key}
  service.name: boltfoundry-com
```

## Implementation Plan

### Phase 1: OpenTelemetry Collector Setup (Priority: High)

**Objective**: Add OpenTelemetry Collector as Kamal accessory for comprehensive
telemetry collection.

**Tasks**:

1. Create OpenTelemetry Collector configuration
2. Update Kamal deployment template
3. Configure collector for HyperDX export

**Files to Modify**:

- `infra/terraform/hetzner/deploy.yml.tpl`
- Create `config/otel_collector.yml`

**Configuration**:

```yaml
# Add to deploy.yml.tpl
accessories:
  otel_collector:
    image: otel/opentelemetry-collector:0.100.0
    port: 4318
    files:
      - config/otel_collector.yml:/etc/otelcol/config.yaml
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    options:
      user: 0
    roles:
      - web
```

### Phase 2: Container and Infrastructure Metrics (Priority: Medium)

**Objective**: Collect container metrics, system performance, and infrastructure
health data.

**Tasks**:

1. Configure Docker container metrics collection
2. Add system resource monitoring (CPU, memory, disk)
3. Set up network and application health checks
4. Configure log aggregation and parsing

**Metrics to Collect**:

- Container resource usage (CPU, memory, network)
- Application uptime and health check status
- HTTP response times and status codes (via proxy)
- Database connection pool status
- Disk usage and I/O metrics

## Technical Specifications

### HyperDX Configuration

- **Endpoint**: `https://in-otel.hyperdx.io`
- **HTTP Port**: 4318
- **gRPC Port**: 4317
- **Authentication**: API key in authorization header
- **Pricing**: Free tier, then $0.40/GB starting at $20/month

### OpenTelemetry Collector Configuration

```yaml
# config/otel_collector.yml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

  prometheus:
    config:
      scrape_configs:
        - job_name: "deno-apps"
          scrape_interval: 15s
          docker_sd_configs:
            - host: unix:///var/run/docker.sock
              refresh_interval: 30s
          relabel_configs:
            - source_labels: [__meta_docker_container_label_service_name]
              regex: boltfoundry-com
              action: keep

exporters:
  otlphttp:
    endpoint: https://in-otel.hyperdx.io
    headers:
      authorization: ${HDX_API_KEY}

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [otlphttp]
    metrics:
      receivers: [otlp, prometheus]
      exporters: [otlphttp]
    logs:
      receivers: [otlp]
      exporters: [otlphttp]
```

### Docker Container Monitoring

```yaml
# Enhanced Docker labels for better monitoring
labels:
  __HDX_API_KEY: ${hyperdx_api_key}
  service.name: boltfoundry-com
  service.version: ${app_version}
  deployment.environment: production
  monitoring.enable: "true"
```

## Integration with Existing Systems

### Infrastructure Monitoring

- Monitor container health and resource usage
- Track deployment success/failure rates
- Alert on system resource thresholds

### Log Aggregation and Analysis

- Centralize application and system logs
- Set up log parsing and structured data extraction
- Create dashboards for log-based insights

## Deployment Strategy

### Environment Variables

```bash
# Required for HyperDX integration
HYPERDX_API_KEY=hdx_xxx...
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
OTEL_SERVICE_NAME=boltfoundry-com
OTEL_RESOURCE_ATTRIBUTES=service.version=1.0.0,deployment.environment=production
```

### GitHub Secrets to Add

- `HYPERDX_API_KEY`: HyperDX API key for telemetry export

### Terraform Variables

```hcl
variable "hyperdx_api_key" {
  description = "HyperDX API key for telemetry"
  type        = string
  sensitive   = true
}
```

## Benefits

### Immediate Wins

- Unified view of logs, metrics, and traces
- Better debugging of production issues
- No vendor lock-in (OpenTelemetry standard)
- Enhanced debugging capabilities for production issues

### Long-term Value

- Performance optimization insights
- User behavior analysis through session replays
- Proactive alerting on system degradation
- Application performance optimization insights

## Risks and Mitigations

### Performance Impact

- **Risk**: OpenTelemetry overhead on application performance
- **Mitigation**: Use sampling for traces, async exporters, resource limits

### Data Volume Costs

- **Risk**: High telemetry volume leading to unexpected costs
- **Mitigation**: Configure sampling rates, filter noisy metrics, monitor usage

### Configuration Complexity

- **Risk**: Complex OpenTelemetry configuration
- **Mitigation**: Start with basic setup, iterate incrementally

## Success Metrics

### Phase 1 Success Criteria

- [ ] OpenTelemetry Collector deployed and receiving data
- [ ] Logs flowing to HyperDX dashboard
- [ ] Basic metrics visible in HyperDX

### Phase 2 Success Criteria

- [ ] Container metrics flowing to HyperDX
- [ ] System resource monitoring active
- [ ] Infrastructure health dashboards created

## Implementation Phases

### Phase 1: OpenTelemetry Collector Foundation

- Create OpenTelemetry Collector configuration file
- Update Kamal deployment template with collector accessory
- Deploy and verify basic collector functionality

### Phase 2: Infrastructure Metrics Collection

- Configure container and infrastructure metrics
- Set up system resource monitoring
- Verify metrics flowing to HyperDX

## References

- [HyperDX Documentation](https://www.hyperdx.io/docs/install/opentelemetry)
- [OpenTelemetry Deno Guide](https://opentelemetry.io/docs/languages/js/getting-started/nodejs/)
- [Kamal Accessories Guide](https://kamal-deploy.org/docs/accessories/)
- [37signals Prometheus + Kamal Example](https://dev.37signals.com/kamal-prometheus/)

---

_This memo follows the "ship fast, iterate" philosophy - start with basic
integration and enhance incrementally based on real usage patterns._
