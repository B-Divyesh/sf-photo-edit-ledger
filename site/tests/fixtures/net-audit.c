#define _GNU_SOURCE
#include <dlfcn.h>
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/socket.h>

int connect(int socket_fd, const struct sockaddr *address, socklen_t address_len) {
  const char *audit = getenv("SIDECAR_LEDGER_NETWORK_AUDIT");
  if (audit) {
    FILE *file = fopen(audit, "a");
    if (file) { fputs("connect\n", file); fclose(file); }
  }
  errno = ENETUNREACH;
  return -1;
}
